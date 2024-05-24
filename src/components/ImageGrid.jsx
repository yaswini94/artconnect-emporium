import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PhotoGrid = ({ photos = [], loading }) => {
  photos = photos || [];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (photos.length === 0) {
    return <div>No arts to display</div>;
  }

  return (
    <div className="img-grid">
      {photos.map((photo) => (
        <motion.div
          className="img-wrap"
          key={photo.id}
          layout
          whileHover={{ opacity: 1 }}
          s
          // onClick={() => setSelectedImg(photo.imageUrl)}
        >
          <Link to={`/photos/${photo.id}`}>
            <motion.img
              src={photo.imageUrl}
              alt={photo.fileName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

PhotoGrid.propTypes = {
  photos: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default PhotoGrid;
