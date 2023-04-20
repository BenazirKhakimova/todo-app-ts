import React, { useCallback, useState } from "react";
import styles from "./index.module.scss";
interface InputPlusprops {
    onAdd: (title: string) => void;
}

const InputPlus: React.FC<InputPlusprops> = ({ onAdd }) => {
    const [inputValue, setInputValue] = useState("");

    const addTask = useCallback(() => {
        onAdd(inputValue);
        setInputValue("");
    }, [inputValue]);

    return (
        <div className={styles.inputPlus}>
            <input
                type="text"
                className={styles.inputPlusTitle}
                placeholder="Type here..."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        addTask();
                    }
                }}
            />
            <button
                className={styles.inputPlusButton}
                type="button"
                area-label="Add"
                onClick={() => addTask()}
            />
        </div>
    );
};

export { InputPlus };
