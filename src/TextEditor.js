import React, { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
// import * as htmlToImage from 'html-to-image';
// const download = require("downloadjs");
export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [documentTitle, setDocumentTitle] = useState("");
  const SAVE_INTERVAL_MS = 1000;

  // connecting to the socket
  useEffect(() => {
    const s = io("https://api-googledoc-clone.herokuapp.com/");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // autosave
  useEffect(() => {
    if (socket == null || quill == null) return;
    const saveInterval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(saveInterval);
  }, [quill, socket]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.once(
      "load-document",
      (document) => {
        quill.enable();
        setDocumentTitle(document.title);
        quill.setContents(document.data);
      },
      [socket, quill, documentId]
    );

    socket.emit("get-document", documentId); // sending the document id
  }, [quill, socket, documentId]);
  // receiving changes and updating the document
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [quill, socket]);

  // sending changes to the server
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null) return;
    const handler = (title) => {
      setDocumentTitle(title);
    };
    socket.on("title-load", handler);

    return () => socket.off("title-load", handler);
  }, [socket]);
  const wrapperRef = useCallback((wrapper) => {
    const TOOLBAR_OPTIONS = [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      ["image", "blockquote", "code-block"],
      ["clean"],
    ];
    if (wrapper == null) return;
    wrapper.innerHtml = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });

    q.disable();
    setQuill(q);
  }, []);

  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value);
    socket.emit("title-change", e.target.value);
  };

  return (
    <>
      <div className="textEditor-header">
        <a
        style = {{padding: "0.7em 1.3em", fontSize:"16px", whiteSpace:"nowrap"}} 
        className ="btn" href="/documents"> &#129128;&nbsp; Documents  </a>
        <input
          className="document-title"
          value={documentTitle}
          onChange={handleTitleChange}
          placeholder="Document Title"
        ></input>
      </div>
      <div id={"container"} className="container" ref={wrapperRef}></div>
    </>
  );
}
