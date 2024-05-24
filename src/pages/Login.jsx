import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      setLoading(true);
      if (!passwordRef.current?.value || !emailRef.current?.value) {
        setErrorMsg("Please fill in the fields");
        return;
      }
      const { data, error } = await login({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      if (error) setErrorMsg(error.message);
      if (!error && data) navigate("/");
    } catch (error) {
      setErrorMsg("Email or Password Incorrect");
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="title text-center">Login</h2>
      <div className="form-inner">
        <form onSubmit={handleSubmit}>
          <div className="input-block" id="email">
            <div className="input-label">Email</div>
            <input type="email" ref={emailRef} required />
          </div>
          <div className="input-block" id="password">
            <div className="input-label">Password</div>
            <input type="password" ref={passwordRef} required />
          </div>
          {errorMsg && <div>{errorMsg}</div>}
          <div className="btn-block">
            <button className="btn-primary" disabled={loading} type="submit">
              Login
            </button>
          </div>
        </form>
        <div className="form-help-block">
          New User? <Link to={"/register"}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
