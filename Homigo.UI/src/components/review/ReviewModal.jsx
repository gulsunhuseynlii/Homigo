import { useState } from "react";
import toast from "react-hot-toast";

import { createReview } from "../../services/reviewService";

function ReviewModal({
  order,
  onClose,
  onSuccess,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      await createReview({
        orderId: order.id,
        rating,
        comment,
      });

      toast.success("Review submitted.");

      onSuccess();
    } catch {
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white p-6">

        <h2 className="mb-6 text-2xl font-bold">
          Write Review
        </h2>

        <div className="mb-6 flex justify-center gap-2">

          {[1,2,3,4,5].map((star)=>(
            <button
              key={star}
              onClick={()=>setRating(star)}
              className="text-4xl"
            >
              {star <= rating ? "⭐" : "☆"}
            </button>
          ))}

        </div>

        <textarea
          rows={4}
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full rounded-xl border p-3"
        />

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Submit
          </button>

        </div>

      </div>

    </div>
  );
}

export default ReviewModal;