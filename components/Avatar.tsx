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
    <div className={`w-${size} h-${size}`}>
      {photoURL ? (
        <img
          src={photoURL}
          className={`h-full w-full rounded-full object-cover`}
        />
      ) : (
        <div
          className={`flex h-${size} w-${size} items-center justify-center rounded-full bg-blue-400 text-white`}
        >
          {displayName?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
