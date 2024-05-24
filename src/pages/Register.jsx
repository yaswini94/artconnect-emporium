import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const fullnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { navigate } = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !passwordRef.current?.value ||
      !emailRef.current?.value ||
      !confirmPasswordRef.current?.value
    ) {
      setErrorMsg("Please fill all the fields");
      return;
    }
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setErrorMsg("Passwords doesn't match");
      return;
    }
    try {
      setErrorMsg("");
      setLoading(true);
      const { data, error } = await register({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        fullname: fullnameRef.current.value,
      });
      if (!error && data) {
        navigate("/");
        setMsg(
          "Registration Successful. Check your email to confirm your account"
        );
      }
    } catch (error) {
      setErrorMsg("Error in Creating Account, please validate all fields: ");
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="title text-center">Register</h2>
      <div className="form-inner">
        <form onSubmit={handleSubmit}>
          <div className="input-block" id="fullname">
            <div className="input-label">Full Name</div>
            <input type="text" ref={fullnameRef} required />
          </div>
          <div className="input-block" id="email">
            <div className="input-label">Email</div>
            <input type="email" ref={emailRef} required />
          </div>
          <div className="input-block" id="password">
            <div className="input-label">Password</div>
            <input type="password" ref={passwordRef} required />
          </div>
          <div className="input-block" id="confirm-password">
            <div className="input-label">Confirm Password</div>
            <input type="password" ref={confirmPasswordRef} required />
          </div>
          {errorMsg && <div>{errorMsg}</div>}
          {msg && <div>{msg}</div>}
          <div className="btn-block">
            <button disabled={loading} type="submit" className="btn-primary">
              Register
            </button>
          </div>
        </form>
        <div className="form-help-block">
          Already a User? <Link to={"/login"}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
