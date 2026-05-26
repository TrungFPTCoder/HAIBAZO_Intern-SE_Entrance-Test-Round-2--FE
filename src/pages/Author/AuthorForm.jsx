import { Button, Form, Input, message, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearCurrentAuthor,
  createAuthor,
  fetchAuthorDetail,
  updateAuthor,
} from "../../store/slices/authorSlice";

export default function AuthorForm({ id: propId, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const id = propId !== undefined ? propId : routeId;
  const isEdit = Boolean(id);
  const isModal = propId !== undefined;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { currentAuthor, detailLoading } = useSelector(
    (state) => state.authors,
  );
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchAuthorDetail(id));
    }
    return () => {
      dispatch(clearCurrentAuthor());
    };
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && currentAuthor) {
      form.setFieldsValue({
        name: currentAuthor.name,
      });
    }
  }, [isEdit, currentAuthor, form]);

  const handleSubmit = (values) => {
    const authorData = {
      name: values.name,
    };
    setSubmitting(true);
    if (isEdit) {
      dispatch(updateAuthor({ id, authorData }))
        .unwrap()
        .then(() => {
          setSubmitting(false);
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/authors");
          }
        })
        .catch((err) => {
          setSubmitting(false);
          message.error("Error updating author: " + err);
        });
    } else {
      dispatch(createAuthor(authorData))
        .unwrap()
        .then(() => {
          setSubmitting(true);
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/authors");
          }
        })
        .catch((err) => {
          setSubmitting(false);
          message.error("Error creating author: " + err);
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
          label="Author Name"
          rules={[
            { required: true, message: "Name must not empty" },
            { whitespace: true, message: "Name must not empty" },
          ]}
        >
          <Input placeholder="Name of author" size="large"></Input>
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

  if (isModal) {
    return formContent;
  }
  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold text-zinc-850 tracking-tight">
          {isEdit ? "Update Author" : "Create Author"}
        </h1>
        <p className="text-sm text-zinc-500 font-light">
          {isEdit
            ? "Edit the detailed information of the author."
            : "Fill in the details below to add a new author to the system."}
        </p>
      </div>
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-8 shadow-xs">
        {formContent}
      </div>
    </div>
  );
}
