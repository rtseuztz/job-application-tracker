import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Modal.module.css'


export type ModalProps = {
    show?: boolean,
    element?: Element,
    pageContainer?: Element,
    width?: number,
    children: React.ReactNode
  };
  

export function Modal(props: ModalProps) {
    var [top, setTop] = useState<number>(0)
    var [y, setY] = useState<number>(0)
    var [x, setX] = useState<number>(0)
    const modalPadding = 15
    useEffect(() => {
        if (props.element) {
            const rect = props.element.getBoundingClientRect()
            setTop(rect.top)
            setY(rect.y)
            setX(rect.x + rect.left)
        }
    }, [props.element])
    return (
        <>
        {props.show ?
            <div style={{width: "auto"}} className={styles.modal}>
                <svg className={styles.arrow} id="triangle" xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink" width="30%" height="30%" viewBox="0 0 100 100">
                        <polygon points="50 0, 100 100, 0 100"/>
                </svg>
                <div className={styles.modalContent}>
                    {props.children}
                </div>
            </div>

            :
            <>
            </>
        }
        </>
    )
}