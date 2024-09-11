"use client"; 
import { useState, useEffect } from 'react';
import axios from 'axios';
import DocumentCard from '@/components/DocumentCard'; // 需要将 Vue 组件转换为 React 组件
import { startWindToast } from '@mariojgt/wind-notify/packages/index.js'; // 确保这个包在 Next.js 中也可用

export default function DocumentManage() {
    const [documents, setDocuments] = useState([]);
    const [newDoc, setNewDoc] = useState({ title: '', content: '', published: true });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteDoc, setDeleteDoc] = useState({ id: -1, title: '' });
    const baseUrl = 'http://localhost:8000/';

    useEffect(() => {
        getDocuments();
    }, []);

    const getDocuments = async () => {
        try {
            const response = await axios.get(`${baseUrl}document/`);
            setDocuments(response.data.documents);
            console.log(response)
        } catch (error) {
            console.error(error);
        }
    };

    const toggleAddModal = () => setShowAddModal(!showAddModal);
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

    const showAddDocumentModal = () => toggleAddModal();
    const showDeleteDocumentModal = (id, title) => {
        setDeleteDoc({ id, title });
        toggleDeleteModal();
    };

    const cancelAdd = () => toggleAddModal();

    const addDocument = async () => {
        try {
            const response = await axios.post(`${baseUrl}document/`, newDoc);
            console.log(response);
            toggleAddModal();
            getDocuments();
            setNewDoc({ title: '', content: '', published: true});
            startWindToast('Add document successfully!', 'success');
        } catch (error) {
            console.error(error);
        }
    };

    const deleteDocument = async () => {
        if (deleteDoc.id === -1) {
            startWindToast('Please select document to delete', 'warning');
            return;
        }
        try {
            const response = await axios.delete(`${baseUrl}document/${deleteDoc.id}`);
            toggleDeleteModal();
            startWindToast(`Delete document ${deleteDoc.title} successfully!`, 'success');
            console.log(response);
            getDocuments();
        } catch (error) {
            startWindToast('Delete document failed!', 'error');
            console.error(error);
        }
    };

    return (
        <div className="h-screen w-screen">
            <div>
                {documents.length > 0 ? (
                    <div className="pt-20">
                        {documents.map((doc, index) => (
                            <DocumentCard
                                key={index}
                                title={doc.title}
                                content={doc.content}
                                id={doc.id}
                                published={doc.published}
                                style={{
                                    marginTop: '30px',
                                    width: '33%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                                onDocDelete={() => showDeleteDocumentModal(doc.id, doc.title)}
                                onDocEdit={() => {/* Implement edit logic here */}}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-screen items-center justify-center">
                        <div className="alert shadow-lg w-1/3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="stroke-info shrink-0 w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <div className="flex">
                                <div>
                                    <h3 className="font-bold">Please Add Document</h3>
                                    <div className="text-xs">Click add button on bottom right.</div>
                                </div>
                                <svg
                                    className="w-9 h-9 text-info animate-bounce fixed bottom-40 right-12"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 1v12m0 0 4-4m-4 4L1 9"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={showAddDocumentModal}
                title="Add Document"
                className="fixed z-90 bottom-20 right-8 bg-info w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-info hover:drop-shadow-2xl duration-300"
            >
                <svg
                    className="w-7 h-7 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>
            </button>

            <dialog className={`modal ${showAddModal ? 'modal-open' : ''}`}>
                <form method="dialog" className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg">Add New Document</h3>

                    <div className="card">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input
                            type="text"
                            value={newDoc.title}
                            onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                            className="text-2xl input input-bordered"
                            style={{ width: '100%' }}
                        />

                        <label className="label">
                            <span className="label-text">Content</span>
                        </label>
                        <textarea
                            className="textarea input-bordered textarea-md"
                            value={newDoc.content}
                            onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex float-right">
                        <div className="modal-action mr-3">
                            <button className="btn btn-success" onClick={addDocument}>
                                Add
                            </button>
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={cancelAdd}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </dialog>

            <dialog className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
                <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">Delete</h3>
                    <p className="py-4">
                        Do you want to delete document
                        <span className="font-bold"> {deleteDoc.title} </span>?
                    </p>
                    <div className="modal-action">
                        <div>
                            <button className="btn btn-error" onClick={deleteDocument}>
                                Delete
                            </button>
                            <button className="btn btn-ghost ml-3" onClick={toggleDeleteModal}>Close</button>
                        </div>
                    </div>
                </form>
            </dialog>
        </div>
    );
}