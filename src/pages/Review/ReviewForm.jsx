import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, Button, Space, Spin, message } from "antd";
import { fetchReviewDetail, clearCurrentReview, createReview, updateReview } from "../../store/slices/reviewSlice";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import bookService from "../../services/bookService";

export default function ReviewForm({ id: propId, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const id = propId !== undefined ? propId : routeId;
  const isEdit = Boolean(id);
  const isModal = propId !== undefined;

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const { currentReview, detailLoading: loadingReviews } = useSelector((state) => state.reviews);
  
  // Infinite scroll for lazy loading books instead of fetching 100
  const { items: books, loading: loadingBooks, onPopupScroll } = useInfiniteScroll(bookService.getAll);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchReviewDetail(id));
    }
    return () => {
      dispatch(clearCurrentReview());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentReview) {
      form.setFieldsValue({
        bookId: currentReview.bookId,
        review: currentReview.review,
      });
    }
  }, [isEdit, currentReview, form]);

  const bookOptions = (() => {
    const opts = books.map((book) => ({
      value: book.id,
      label: book.name,
    }));
    const editingReview = isEdit ? currentReview : null;
    if (editingReview && editingReview.bookId && !books.find(b => b.id === editingReview.bookId)) {
      opts.unshift({ value: editingReview.bookId, label: editingReview.bookName || `Book #${editingReview.bookId}` });
    }
    return opts;
  })();

  const handleSubmit = (values) => {
    const reviewData = {
      bookId: values.bookId,
      review: values.review,
    };

    setSubmitting(true);
    if (isEdit) {
      dispatch(updateReview({ id, reviewData })).unwrap().then(() => {
        setSubmitting(false);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/reviews");
        }
      }).catch((err) => {
        setSubmitting(false);
        message.error("Error updating review: " + err);
      });
    } else {
      dispatch(createReview(reviewData)).unwrap().then(() => {
        setSubmitting(false);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/reviews");
        }
      }).catch((err) => {
        setSubmitting(false);
        message.error("Error creating review: " + err);
      });
    }
  };

  const formContent = (
    <Spin spinning={isEdit && loadingReviews} tip="Loading data...">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="bookId"
          label={<span className="font-medium text-zinc-655">Select Book</span>}
          rules={[{ required: true, message: "Book must not empty" }]}
        >
          <Select
            placeholder="Select a book from the list"
            size="large"
            className="rounded-xl select-custom"
            showSearch={{
              optionFilterProp: "label"
            }}
            onPopupScroll={onPopupScroll}
            loading={loadingBooks}
            options={bookOptions}
          />
        </Form.Item>

        <Form.Item
          name="review"
          label={<span className="font-medium text-zinc-655">Review Content</span>}
          rules={[
            { required: true, message: "Review must not empty" },
            { whitespace: true, message: "Review must not empty" }
          ]}
        >
          <Input.TextArea
            placeholder="Enter your review comments here..."
            size="large"
            rows={5}
            className="rounded-xl resize-none"
          />
        </Form.Item>
        
        <Form.Item className="mb-0 flex justify-end gap-2 pt-4 border-t border-zinc-100">
          <Space>
            <Button 
              onClick={() => isModal ? onCancel() : navigate("/reviews")} 
              size="large" 
              className="rounded-xl cursor-pointer font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              className="bg-violet-655 hover:bg-violet-750 text-white rounded-xl cursor-pointer font-semibold"
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold text-zinc-850 tracking-tight">
          {isEdit ? "Edit Review" : "Create Review"}
        </h1>
        <p className="text-sm text-zinc-500 font-light">
          {isEdit ? "Update your review content for the book." : "Share your thoughts about a book in the system."}
        </p>
      </div>

      <div className="bg-white border border-zinc-150/80 rounded-3xl p-8 shadow-xs">
        {formContent}
      </div>
    </div>
  );
}

