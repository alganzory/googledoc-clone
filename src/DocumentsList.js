import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DocumentsList() {
  const [documentsList, setDocumentsList] = useState([]);
  const [thumbnailsList, setThumbnails] = useState([]);
  useEffect(() => {
    
    axios
      .get("https://api-googledoc-clone.herokuapp.com/documents")
      .then((res) => {
        setDocumentsList(res.data)
        axios.get ("https://api-googledoc-clone.herokuapp.com/document-thumbnail/"+res.data[0]._id)
        .then(ressss => console.log(ressss));
      }
      );



  }, []);

  return (
    <>
      <div className="documentsList-header">
        <h2>Documents</h2>
        <form method="GET" action="/">
          <button
            className="btn"
            style={{
              backgroundColor: "hsl(120, 70%, 40%)",
              padding: ".8em 1em",
              fontSize: "15px",
            }}
          >
            New Document
          </button>
        </form>
      </div>
      <div className="document-cards-container">
        <div className="document-cards-grid">
          {/* {
            documentsList?
            documentsList.forEach (document => {
              const documentImage =require (`./imgs/${document._id}-screenshot.png`).default;
              documentsImages.push(documentImage); 
            }):""
          } */}
          {documentsList
            ? documentsList.map((document, idx) => (
                <div className="document-card-card">
                  <div className="thumbnail-holder">
                  <a
                      href={`/documents/${document._id}`}
                    >
                    <img
                      className="document-thumbnail"
                      src={`./images/${document.screenshotPath}.png`}
                      alt={document.title}
                      style={{ width: "100%" }} 
                    />
                    </a>
                  </div>
                  <div className="document-card" key={document._id}>
                    <a
                      className="document-card-title"
                      href={`/documents/${document._id}`}
                    >
                      {document.title}
                    </a>

                    <p className="document-card-date">
                      Opened: {document.dateOpened}
                      <br></br>
                      Created: {document.dateCreated}
                    </p>

                    <form onSubmit={(e) => e.preventDefault()}>
                      <a
                        href={`/documents/${document._id}`}
                        className="btn"
                        style={{ backgroundColor: "hsl(200, 100%, 50%)" }}
                      >
                        Open
                      </a>
                      <button
                        onClick={() => {
                          setDocumentsList(
                            documentsList.filter((doc) => {
                              return doc._id !== document._id;
                            })
                          );
                          axios
                            .delete(
                              "https://api-googledoc-clone.herokuapp.com/documents/" + document._id
                            )
                            .then()
                            .catch((err) => console.log(err));
                        }}
                        className="btn"
                        style={{ backgroundColor: "hsl(0, 80%, 50%)" }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </>
  );
}
