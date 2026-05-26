import { Button, Form, Input, Select, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearCurrentBook,
  createBook,
  fetchBookDetail,
  updateBook,
} from "../../store/slices/bookSlice";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import authorService from "../../services/authorService";

export default function BookForm({ id: propId, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const id = propId !== undefined ? propId : routeId;
  const isEdit = Boolean(id);
  const isModal = propId !== undefined;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { currentBook, detailLoading } = useSelector((state) => state.books);
  const {
    items: authors,
    loading: loadingAuthors,
    onPopupScroll,
  } = useInfiniteScroll(authorService.getAll);
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchBookDetail(id));
    }
    return () => {
      dispatch(clearCurrentBook());
    };
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && currentBook) {
      form.setFieldsValue({
        name: currentBook.name,
        authorId: currentBook.authorId,
      });
    }
  }, [isEdit, currentBook, form]);

  const authorOptions = (() => {
    const opts = authors.map((author) => ({
      value: author.id,
      label: author.name,
    }));
    const editingBook = isEdit ? currentBook : null;
    if (
      editingBook &&
      editingBook.authorId &&
      !authors.find((a) => a.id === editingBook.authorId)
    ) {
      opts.unshift({
        value: editingBook.authorId,
        label: editingBook.authorName || `Author #${editingBook.authorId}`,
      });
    }
    return opts;
  })();

  const handleSubmit = (values) => {
    const bookData = {
      name: values.name,
      authorId: values.authorId,
    };
    setSubmitting(true);
    if (isEdit) {
      dispatch(updateBook({ id, bookData }))
        .unwrap()
        .then(() => {
          setSubmitting(false);
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/books");
          }
        })
        .catch((err) => {
          setSubmitting(false);
          message.error("Error updating book: " + err);
        });
    } else {
      dispatch(createBook(bookData))
        .unwrap()
        .then(() => {
          setSubmitting(true);
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/books");
          }
        })
        .catch((err) => {
          setSubmitting(false);
          message.error("Error creating book: " + err);
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
          name="name"
          label="Book Name"
          rules={[
            { required: true, message: "Name of book must not empty" },
            { whitespace: true, message: "Name of book must not empty" },
          ]}
        >
          <Input placeholder="Name of book" size="large"></Input>
        </Form.Item>

        <Form.Item
          name="authorId"
          label="Choose author: "
          rules={[
            {
              required: true,
              message: "You have to choose author for this book!",
            },
          ]}
        >
          <Select
            placeholder="Select author from list"
            size="large"
            showSearch={{ optionFilterProp: "label" }}
            onPopupScroll={onPopupScroll}
            loading={loadingAuthors}
            options={authorOptions}
          ></Select>
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end gap-2 pt-4 border-t border-zinc-100">
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
              onClick={() => (isModal ? onCancel() : navigate("/authors"))}
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
          {isEdit ? "Update Book" : "Create Book"}
        </h1>
        <p className="text-sm text-zinc-500 font-light">
          {isEdit
            ? "Edit the detailed information of the book."
            : "Fill in the details below to add a new book to the system."}
        </p>
      </div>
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-8 shadow-xs">
        {formContent}
      </div>
    </div>
  );
}
