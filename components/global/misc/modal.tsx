import { Dialog, Transition } from "@headlessui/react";
import React from "react";

type Props = {
  storageDialogOpen: boolean;
  setStorageDialogOpen: () => void;
  setStorageDialogClosed: () => void;
  height?: string | null;
  width?: string | null;
  content: React.ReactElement; //contents of the modal (e.g. <div>...</div>)
  title: string; //title of the modal
};

function HeliosModal({
  storageDialogOpen,
  setStorageDialogClosed,
  setStorageDialogOpen,
  height,
  width,
  content,
  title,
}: Props) {
  return (
    <Dialog
      as="div"
      className="relative z-[11]"
      open={storageDialogOpen}
      onClose={() => setStorageDialogClosed()}
    >
      <Transition
        appear
        show={storageDialogOpen}
        enter="ease-in duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-secondary/50" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-full w-full items-center justify-center p-4 text-center">
            <Dialog.Panel
              className={`${height} ${width} bg-primary transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all`}
            >
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-text"
              >
                {title ? (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-text"
                  >
                    {title}
                  </Dialog.Title>
                ) : (
                  ""
                )}
              </Dialog.Title>
              {content}
            </Dialog.Panel>
          </div>
        </div>
      </Transition>
    </Dialog>
  );
}

export default HeliosModal;
