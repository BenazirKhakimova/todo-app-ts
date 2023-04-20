import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

interface InputTaskProps {
    id: string;
    title: string;
    onDone: (id: string) => void;
    onEdited: (id: string, title: string) => void;
    onRemoved: (id: string) => void;
}

const InputTask: React.FC<InputTaskProps> = ({
    id,
    title,
    onDone,
    onEdited,
    onRemoved,
}) => {
    const [checked, setChecked] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [value, setValue] = useState(title);
    const editModeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editMode) {
            editModeRef?.current?.focus();
        }
    }, [editMode]);

    return (
        <div className={styles.inputTask}>
            <label className={styles.inputTaskLabel}>
                <input
                    type="checkbox"
                    disabled={editMode}
                    className={styles.inputTaskCheckbox}
                    checked={checked}
                    onChange={(event) => {
                        setChecked(event.target.checked);

                        if (event.target.checked) {
                            setTimeout(() => {
                                onDone(id);
                            }, 300);
                        }
                    }}
                />
                {editMode ? (
                    <input
                        type="text"
                        ref={editModeRef}
                        className={styles.inputTaskEditTitle}
                        value={value}
                        onChange={(event) => {
                            setValue(event.target.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                onEdited(id, value);
                                setEditMode(false);
                            }
                        }}
                    />
                ) : (
                    <h3>{title}</h3>
                )}
            </label>
            {editMode ? (
                <button
                    aria-label="Save"
                    className={styles.inputTaskSave}
                    onClick={() => {
                        onEdited(id, value);
                        setEditMode(false);
                    }}
                />
            ) : (
                <button
                    aria-label="Edit"
                    className={styles.inputTaskEdit}
                    onClick={() => setEditMode(true)}
                />
            )}

            <button
                aria-label="Remove"
                className={styles.inputTaskRemove}
                onClick={() => {
                    if (confirm("Are you sure ?")) {
                        onRemoved(id);
                    }
                }}
            />
        </div>
    );
};

export { InputTask };
