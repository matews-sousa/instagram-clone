import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import useImageSelection from "../hooks/useImageSelection";
import useFileUpload from "../hooks/useFileUpload";
import Avatar from "./Avatar";

interface CreatePostModal {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const CreatePostModal = ({ isOpen, setIsOpen }: CreatePostModal) => {
  const [caption, setCaption] = useState("");
  const { currentUser } = useAuth();
  const { selectImage, file, imagePreview, setImagePreview, setFile } =
    useImageSelection();
  const { upload, isUploading, progress } = useFileUpload();

  const closeModal = () => {
    setIsOpen(false);
  };

  const publish = async () => {
    if (currentUser && caption && file) {
      await upload(file, "posts", async (url) => {
        closeModal();
        await addDoc(collection(db, "posts"), {
          authorId: currentUser?.uid,
          caption: caption,
          imageUrl: url,
          likes: [],
          comments: [],
          createdAt: Timestamp.now(),
        });
        setImagePreview("");
        setFile(null);
      });
    }
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
            <div className="my-8 inline-block w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white pt-4 align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="flex items-center justify-between border-b border-gray-400 px-6 pb-4 text-lg font-medium leading-6 text-gray-900"
              >
                <button
                  disabled={!imagePreview}
                  className="flex items-center text-sm font-semibold text-blue-500 disabled:cursor-default disabled:text-gray-500"
                  onClick={() => setImagePreview("")}
                >
                  <ArrowNarrowLeftIcon className="mr-2 h-5 w-5" />
                  Back
                </button>
                <p className="flex-1 text-center">Create new post</p>
                <button
                  disabled={!imagePreview}
                  className="text-sm font-semibold text-blue-500 disabled:cursor-default disabled:text-gray-500"
                  onClick={publish}
                >
                  Publish
                </button>
              </Dialog.Title>
              <div className="relative flex h-[70vh] items-center justify-center overflow-y-auto">
                {imagePreview ? (
                  !isUploading ? (
                    <div className="h-full w-full flex-col md:flex md:flex-row">
                      <div className="w-full md:w-[70%]">
                        <img
                          src={imagePreview}
                          className="h-full object-cover"
                        />
                      </div>
                      <div className="w-full p-4 md:w-[30%]">
                        <div className="flex items-center space-x-4">
                          <Avatar
                            photoURL={currentUser?.photoURL}
                            displayName={currentUser?.displayName}
                          />
                          <p className="text-lg font-semibold">
                            {currentUser?.username}
                          </p>
                        </div>
                        <textarea
                          placeholder="Write a caption..."
                          className="textarea textarea-bordered mt-4 w-full"
                          onChange={(e) => setCaption(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-end gap-2">
                      <h3 className="text-3xl font-bold">Publishing...</h3>
                      <progress
                        className="progress progress-info w-64"
                        value={progress}
                        max="100"
                      ></progress>
                      <p className="text-2xl font-semibold">{progress}%</p>
                    </div>
                  )
                ) : (
                  <>
                    <input
                      type="file"
                      id="fileInput"
                      className="absolute inset-0 z-10 w-full opacity-0"
                      onChange={selectImage}
                      accept="image/*"
                    />
                    <div className="absolute z-50 flex flex-col items-center space-y-2">
                      <p className="text-lg font-semibold">
                        Drag photos and videos here
                      </p>
                      <label
                        htmlFor="fileInput"
                        className="btn btn-info btn-sm"
                      >
                        Select from your computer
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreatePostModal;
