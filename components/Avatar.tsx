const Avatar = ({
  photoURL,
  displayName,
  size = 8,
}: {
  photoURL?: string | null;
  displayName?: string | null;
  size?: number;
}) => {
  return (
    <div className={`h-${size} w-${size} rounded-full`}>
      {photoURL ? (
        <img src={photoURL} className={`w-full rounded-full object-cover`} />
      ) : (
        <div
          className={`bg-blue-400 h-${size} w-${size} flex items-center justify-center rounded-full text-white`}
        >
          {displayName?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
