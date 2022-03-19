import Image from "next/image";

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
    <>
      {photoURL ? (
        <div className="avatar">
          <div className={`w-${size} relative`}>
            <Image src={photoURL} layout="fill" className="rounded-full" />
          </div>
        </div>
      ) : (
        <div className="avatar placeholder">
          <div
            className={`rounded-full bg-neutral-focus text-neutral-content w-${size}`}
          >
            <span>{displayName?.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Avatar;
