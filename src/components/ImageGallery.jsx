import { createPortal } from "react-dom";
import { useMemo, useState } from "react";

import {
  useSensor,
  DndContext,
  useSensors,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

// custom react hooks.
import useImages from "../hooks/useImages";

// images.
import photoIcon from "../assets/images/photo-icon.png";
import transparentImage from "../assets/images/transparent-image.png";

// react components.
import SortableImage from "./SortableImage";

const ImageGallery = () => {
  const [selected, setSelected] = useState(new Set());
  const [activeImage, setActiveImage] = useState(null);

  const { images, setImages, deleteImages } = useImages();
  const imageIds = useMemo(() => images.map((image) => image.id));

  // select/unselect images.
  const changeHandler = (id) => {
    const previous = new Set(selected);

    if (previous.has(id)) {
      previous.delete(id);
    } else {
      previous.add(id);
    }

    setSelected(previous);
  };

  // unselect all selected images.
  const unselectAll = () => {
    setSelected(new Set());
  };

  // delete all selected images.
  const handleDelete = () => {
    deleteImages(selected);
    setSelected(new Set());
  };

  // set active image on drag start.
  const handleDragStart = (event) => {
    const { active } = event;

    const activeImage = { id: active.id, url: active?.data.current.url };
    setActiveImage(activeImage);
  };

  // rearrange the images on drag end.
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over) return;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);

      const updateImages = arrayMove(images, oldIndex, newIndex);

      setImages(updateImages);
    }

    setActiveImage(null);
  };

  // set active image on drag cancel.
  const handleDragCancel = () => {
    setActiveImage(null);
  };

  // sensors configuration for click and touch events.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 10 } })
  );

  return (
    <div className="gallery-container">
      <div className="gallery-toolbar">
        <div className="toolbar-checkbox-container">
          {selected.size > 0 && (
            <input
              type="checkbox"
              onChange={unselectAll}
              checked={selected.size}
              className="toolbar-checkbox"
            />
          )}

          <div className="toolbar-text">
            {selected.size > 0 ? `${selected.size} Files Selected` : "Gallery"}
          </div>
        </div>

        {selected.size > 0 && (
          <button onClick={handleDelete} className="toolbar-delete-button">
            Delete files
          </button>
        )}
      </div>

      <hr className="divider" />

      <div className="image-grid">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          collisionDetection={closestCenter}
        >
          <SortableContext items={imageIds} strategy={rectSortingStrategy}>
            {images.map(({ id, url }) => (
              <SortableImage
                id={id}
                key={id}
                url={url}
                selected={selected}
                changeHandler={changeHandler}
              />
            ))}
          </SortableContext>

          {createPortal(
            <DragOverlay adjustScale={true}>
              {activeImage && (
                <div className="grid-item">
                  <div className="group">
                    <img src={activeImage?.url} />
                  </div>
                </div>
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>

        <div className="add-image-item">
          <img src={transparentImage} />
          <div className="add-image-elements">
            <img src={photoIcon} className="h-7 w-7" />
            <p className="add-image-text">Add Images</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
