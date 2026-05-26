import { Button, Divider, Form, Input, Select, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import bookService from "../../services/bookService";
import {
  clearCurrentReview,
  createReview,
  fetchReviewDetail,
  updateReview,
} from "../../store/slices/reviewSlice";

export default function ReviewForm({ id: propId, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { TextArea } = Input;
  const { id: routeId } = useParams();
  const id = propId !== undefined ? propId : routeId;
  const isEdit = Boolean(id);
  const isModal = propId !== undefined;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { currentReview, detailLoading } = useSelector(
    (state) => state.reviews,
  );
  const {
    items: books,
    loading: loadingBooks,
    onPopupScroll,
  } = useInfiniteScroll(bookService.getAll);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchReviewDetail(id));
    }
    return () => {
      dispatch(clearCurrentReview());
    };
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && currentReview) {
      form.setFieldsValue({
        review: currentReview.review,
        bookId: currentReview.bookId,
      });
    }
  }, [isEdit, currentReview, form]);

  const bookOptions = (() => {
    const opts = books.map((book) => ({
      value: book.id,
      label: book.name,
    }));
    const editingBook = isEdit ? currentReview : null;
    if (
      editingBook &&
      editingBook.bookId &&
      !books.find((a) => a.id === editingBook.bookId)
    ) {
      opts.unshift({
        value: editingBook.bookId,
        label: editingBook.bookName || `Book #${editingBook.bookId}`,
      });
    }
    return opts;
  })();

  const handleSubmit = (values) => {
    const reviewData = {
      review: values.review,
      bookId: values.bookId,
    };
    setSubmitting(true);
    if (isEdit) {
      dispatch(updateReview({ id, reviewData }))
        .unwrap()
        .then(() => {
          setSubmitting(false);
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/reviews");
          }
        })
        .catch((err) => {
          setSubmitting(false);
          message.error("Error updating review: " + err);
        });
    } else {
      dispatch(createReview(reviewData))
        .unwrap()
        .then(() => {
          setSubmitting(true);
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/reviews");
          }
        })
        .catch((err) => {
          setSubmitting(false);
          message.error("Error creating review: " + err);
        });
    }
  };

  const formContent = (
    <Spin spinning={isEdit && detailLoading} description="Loading data...">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="bookId"
          label="Choose book: "
          rules={[
            {
              required: true,
              message: "You have to choose book for review!",
            },
          ]}
        >
          <Select
            placeholder="Select book from list"
            size="large"
            showSearch={{ optionFilterProp: "label" }}
            onPopupScroll={onPopupScroll}
            loading={loadingBooks}
            options={bookOptions}
          ></Select>
        </Form.Item>

        <Form.Item
          name="review"
          label="Your review content"
          rules={[
            {
              required: true,
              message: "Review content of book must not empty",
            },
            {
              whitespace: true,
              message: "Review content of book must not empty",
            },
          ]}
        >
          <TextArea placeholder="Review content" autoSize={{ minRows: 4 }} />
        </Form.Item>

        <Form.Item className="mb-0! flex justify-end">
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              color="purple"
              variant="solid"
              size="large"
              loading={submitting}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
            <Button
              onClick={() => (isModal ? onCancel() : navigate("/reviews"))}
              size="large"
              color="red"
              variant="dashed"
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );
  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold text-zinc-850 tracking-tight">
          {isEdit ? "Update Review" : "Create Review"}
        </h1>
        <p className="text-sm text-zinc-500 font-light">
          {isEdit
            ? "Edit the detailed information of the review."
            : "Fill in the details below to add a new review to the system."}
        </p>
      </div>
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-8 shadow-xs">
        {formContent}
      </div>
    </div>
  );
}
