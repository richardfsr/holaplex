import { Dispatch, FC, ReactNode, SetStateAction, useRef } from 'react';
import { useOutsideAlerter } from '@/hooks/useOutsideAlerter';
import cx from 'classnames';
import { Close } from '@/components/icons/Close';

type ModalProps = {
  open: Boolean;
  // for whatever reason big B and little B are diff to TS...
  setOpen:
    | Dispatch<SetStateAction<boolean>>
    | Dispatch<SetStateAction<Boolean>>
    | ((open: Boolean) => void);
  children: ReactNode;
  title: String;
};

export const Modal: FC<ModalProps> = ({ open, setOpen, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null!);
  useOutsideAlerter(modalRef, () => setOpen(false));

  return (
    <div
      role="dialog"
      className={cx(
        'fixed top-0 left-0 right-0 bottom-0 z-20',
        'bg-gray-800 bg-opacity-40 backdrop-blur-lg ',
        'transition-opacity duration-500 ease-in-out',
        'flex flex-col items-center justify-center',
        {
          'opacity-100': open,
          'opacity-0': !open,
          'pointer-events-auto': open,
          'pointer-events-none': !open,
        }
      )}
    >
      <div
        ref={modalRef}
        className="relative flex h-full max-h-screen w-full flex-col rounded-xl bg-gray-900 p-6 text-white shadow-md sm:max-h-[30rem] sm:max-w-lg"
      >
        <button
          onClick={() => setOpen(false)}
          className={`absolute top-7 right-6 hover:text-gray-400`}
        >
          <Close color={`#ffffff`} />
        </button>
        <div className={`flex w-full items-center justify-center`}>
          <h4 className={`text-2xl font-medium`}>{title}</h4>
        </div>
        <div className={`flex h-full w-full flex-col`}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
