import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import update from "immutability-helper";
import CardItem from "./components/CardItem";
import { fetchDocuments, updateDocumentPosition } from "./components/api";
import "./App.css";

/**
 * Main application component.
 */
const App = () => {
  const [items, setItems] = useState([]); // State for holding the items
  const [show, setShow] = useState(false); // State for controlling modal visibility
  const [selectedImage, setSelectedImage] = useState(""); // State for holding selected image
  const [originalItems, setOriginalItems] = useState([]); // State for holding original items
  const [isSaving, setIsSaving] = useState(false); // State for indicating saving status
  const [lastSaved, setLastSaved] = useState(null); // State for holding last saved timestamp

  // Fetch documents from the backend on component mount
  useEffect(() => {
    fetchDocuments().then((documents) => {
      const sortedDocuments = documents.sort((a, b) => a.position - b.position);
      setItems(sortedDocuments);
      setOriginalItems(sortedDocuments);
    });
  }, []);

  // Autosave every 5 seconds if changes have been made
  useEffect(() => {
    const interval = setInterval(() => {
      if (JSON.stringify(items) !== JSON.stringify(originalItems)) {
        handleSave();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [items, originalItems]);

  // Show modal with selected image
  const handleShow = (image) => {
    setSelectedImage(image);
    setShow(true);
  };

  // Close modal
  const handleClose = () => setShow(false);

  // Function to move card to a new position
  const moveCard = useCallback(
    (fromIndex, toIndex) => {
      const updatedItems = update(items, {
        $splice: [
          [fromIndex, 1],
          [toIndex, 0, items[fromIndex]],
        ],
      });
      setItems(updatedItems);
    },
    [items]
  );

  // Save changes to the backend
  const handleSave = async () => {
    setIsSaving(true);
    await Promise.all(
      items.map((item, index) => updateDocumentPosition(item.id, index))
    );
    setOriginalItems(items);
    setIsSaving(false);
    setLastSaved(new Date());
  };

  // Cancel changes and revert to original items
  const handleCancel = () => {
    setItems(originalItems);
    window.alert("Changes have been canceled!");
  };

  // Check if changes have been made
  const isChanged = JSON.stringify(items) !== JSON.stringify(originalItems);

  // Calculate time since last save
  const timeSinceLastSave = lastSaved
    ? `${Math.floor((new Date() - lastSaved) / 1000)} seconds ago`
    : "Never";

  // Render the component
  return (
    <DndProvider backend={HTML5Backend}>
      <Container className="root">
        <div className="grid-cols-3">
          {items.map((item, index) => (
            <CardItem
              key={item.id}
              item={item}
              index={index}
              moveCard={moveCard}
              onClick={() => handleShow(item.type)}
            />
          ))}
        </div>
        <Row className="mt-3">
          <Col>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!isChanged}
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="ml-2"
              disabled={!isChanged}
            >
              Cancel
            </Button>
            <div className="mt-2">
              {isSaving ? (
                <Spinner animation="border" />
              ) : (
                <span>Last saved: {timeSinceLastSave}</span>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <img
            src={`images/${selectedImage}.gif`}
            alt="Document"
            style={{ width: "400px", height: "400px" }}
          />
        </Modal.Body>
      </Modal>
    </DndProvider>
  );
};

export default App;
