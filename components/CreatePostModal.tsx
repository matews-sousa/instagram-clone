import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../utils/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Avatar from "./Avatar";

interface CreatePostModal {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const CreatePostModal = ({ isOpen, setIsOpen }: CreatePostModal) => {
  const [file, setFile] = useState<any>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const { currentUser } = useAuth();

  const closeModal = () => {
    setIsOpen(false);
  };

  const selectImage = async (e: any) => {
    const f = e.target?.files[0];
    setFile(f);
    const base64: any = await convertBase64(f);
    setImageBase64(base64);
  };

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const publish = async () => {
    if (currentUser && caption && file) {
      const storageRef = ref(storage, `/posts/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setIsPublishing(true);
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          setProgress(prog);
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            await addDoc(collection(db, "posts"), {
              authorId: currentUser?.uid,
              caption: caption,
              imageUrl: url,
              likes: [],
              comments: [],
              createdAt: Timestamp.now(),
            });
            setIsPublishing(false);
            setImageBase64("");
            setFile(null);
            closeModal();
          });
        },
      );
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
                  disabled={imageBase64 === ""}
                  className="flex items-center text-sm font-semibold text-blue-500 disabled:cursor-default disabled:text-gray-500"
                  onClick={() => setImageBase64("")}
                >
                  <ArrowNarrowLeftIcon className="mr-2 h-5 w-5" />
                  Back
                </button>
                <p className="flex-1 text-center">Create new post</p>
                <button
                  disabled={imageBase64 === ""}
                  className="text-sm font-semibold text-blue-500 disabled:cursor-default disabled:text-gray-500"
                  onClick={publish}
                >
                  Publish
                </button>
              </Dialog.Title>
              <div className="relative flex h-[70vh] items-center justify-center overflow-y-auto">
                {imageBase64 ? (
                  !isPublishing ? (
                    <div className="h-full w-full flex-col md:flex md:flex-row">
                      <div className="w-full md:w-[70%]">
                        <img
                          src={imageBase64}
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
