import React, { useState } from "react";
import { Col, Card, Spinner } from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";
import { ItemType } from "./constants";

/**
 * Component for rendering a draggable and droppable card item.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.item - The item data.
 * @param {number} props.index - The index of the item.
 * @param {Function} props.moveCard - Function to move the card to a new position.
 * @param {Function} props.onClick - Function to handle click events.
 * @returns {JSX.Element} The rendered card item component.
 */
const CardItem = ({ item, index, moveCard, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.CARD,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.CARD,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const opacity = isDragging ? 0.5 : 1;
  const imagePath = `images/${item.type}.gif`;

  return (
    <Col
      ref={(node) => drag(drop(node))}
      md={4}
      style={{ opacity }}
      onClick={onClick}
    >
      <Card>
        <Card.Body className="card-body-container">
          <Card.Title>{item.title}</Card.Title>
          {isLoading && (
            <div className="loader">
              <Spinner animation="border" />
            </div>
          )}
          <Card.Img
            variant="top"
            src={imagePath}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            style={{ display: isLoading ? "none" : "block" }}
          />
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CardItem;
