import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

// images.
import transparentImage from "../assets/images/transparent-image.png";

const SortableImage = (props) => {
  const { id, url, selected, changeHandler } = props;
  const sortable = useSortable({ id, data: { url } });

  const {
    listeners,
    transform,
    isDragging,
    attributes,
    transition,
    setNodeRef,
  } = sortable;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="grid-item">
        <div className="group">
          <img src={transparentImage} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      className="grid-item"
    >
      <div className="group">
        <img src={url} />
        <input
          type="checkbox"
          checked={selected.has(id)}
          className="image-checkbox peer"
          onChange={() => changeHandler(id)}
        />
        <div className="image-overlay"></div>
      </div>
    </div>
  );
};

export default SortableImage;
