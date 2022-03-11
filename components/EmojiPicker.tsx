import { Popover } from "@headlessui/react";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

const EmojiPicker = ({
  onEmojiClick,
}: {
  onEmojiClick: (event: any) => void;
}) => {
  return (
    <Popover className="relative h-8 w-8">
      {({ open }) => (
        <>
          <Popover.Button>
            <EmojiHappyIcon className="z-0 h-8 w-8 text-black" />
          </Popover.Button>

          {open && (
            <div className="absolute bottom-12">
              <Popover.Panel static>
                <Picker onSelect={onEmojiClick} />
              </Popover.Panel>
            </div>
          )}
        </>
      )}
    </Popover>
  );
};

export default EmojiPicker;
