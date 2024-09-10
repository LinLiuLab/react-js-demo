import React, { useState } from 'react';
import axios from 'axios';
import { startWindToast } from '@mariojgt/wind-notify/packages/index.js'; // 确保这个包在 Next.js 中也可用

const DocumentCard = ({ id, title, content, published, onDocDelete, onDocEdit }) => {
    const [ifEdit, setIfEdit] = useState(false);
    const [editDoc, setEditDoc] = useState({
        id,
        title,
        content,
        published,
    });

    const deleteDocument = () => {
        onDocDelete(id, title);
    };

    const editDocument = () => {
        setEditDoc({
            id,
            title,
            content,
            published,
        });
        setIfEdit(true);
    };

    const finishEdit = async () => {
        try {
            await axios.put(`http://localhost:8000/document/${editDoc.id}/`, editDoc);
            startWindToast('Edit document successfully!', 'success');
            setIfEdit(false);
            onDocEdit();
        } catch (error) {
            startWindToast('Edit document failed!', 'error');
            console.error(error);
        }
    };

    const cancelEdit = () => {
        setIfEdit(false);
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                {!ifEdit ? (
                    <>
                        <h2 className="card-title">{title}</h2>
                        <p>{content}</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary" onClick={editDocument}>
                                Edit
                            </button>
                            <button className="btn btn-ghost" onClick={deleteDocument}>
                                Delete
                            </button>
                        </div>
                        <p>{published}</p>
                    </>
                ) : (
                    <>
                        <h2 className="card-title">
                            <input
                                type="text"
                                value={editDoc.title}
                                onChange={(e) => setEditDoc({ ...editDoc, title: e.target.value })}
                                className="text-2xl input input-bordered"
                                style={{ width: '100%' }}
                            />
                        </h2>
                        <textarea
                            className="textarea input-bordered textarea-md"
                            value={editDoc.content}
                            onChange={(e) => setEditDoc({ ...editDoc, content: e.target.value })}
                        ></textarea>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary" onClick={finishEdit}>
                                Done
                            </button>
                            <button className="btn btn-ghost" onClick={cancelEdit}>
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DocumentCard;