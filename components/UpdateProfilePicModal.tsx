import { Dialog, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  onChange: (e: ChangeEvent) => void;
  imagePreview: string | null | undefined;
  removeImage: () => void;
  updateImage: () => void;
  isUpdating: boolean;
  progress: number;
}

const UpdateProfilePicModal = ({
  isOpen,
  setIsOpen,
  onChange,
  imagePreview,
  removeImage,
  updateImage,
  isUpdating,
  progress,
}: Props) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-lg transform overflow-hidden rounded-2xl bg-white pt-4 align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="flex items-center justify-between border-b border-gray-400 px-6 pb-4 text-center text-lg font-medium leading-6 text-gray-900"
              >
                <p>Change Profile Photo</p>
                <button
                  className={`btn btn-ghost btn-sm text-blue-500 ${
                    isUpdating && "loading"
                  }`}
                  disabled={isUpdating || imagePreview === ""}
                  onClick={updateImage}
                >
                  Save
                </button>
              </Dialog.Title>
              <div className="overflow-y-auto p-2">
                <div className="relative mb-12 grid h-56 place-items-center">
                  {imagePreview && (
                    <div className="h-full w-44">
                      <img
                        src={imagePreview}
                        className="h-44 w-44 rounded-full object-cover"
                      />
                      {isUpdating && (
                        <div>
                          <h3 className="text-2xl font-bold">Updating...</h3>
                          <progress
                            className="progress progress-info w-full"
                            value={progress}
                            max="100"
                          ></progress>
                          <p className="text-xl font-semibold">{progress}%</p>
                        </div>
                      )}
                    </div>
                  )}

                  {!isUpdating && (
                    <>
                      <h3 className="text-2xl">Drag a photo here</h3>
                      <input
                        type="file"
                        id="profilePic"
                        className="absolute inset-0 h-full w-full opacity-0"
                        onChange={onChange}
                        accept="image/*"
                      />
                    </>
                  )}
                </div>
                <div className="mt-4 flex flex-col space-y-2">
                  {!isUpdating && (
                    <>
                      <div className="w-full">
                        <label htmlFor="profilePic" className="btn btn-info">
                          Photo from your computer
                        </label>
                      </div>
                      <button
                        className="btn btn-ghost mx-auto w-1/2 text-red-600"
                        onClick={removeImage}
                        disabled={imagePreview === ""}
                      >
                        Remove profile photo
                      </button>
                      <button
                        className="btn btn-ghost mx-auto w-1/2"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateProfilePicModal;
