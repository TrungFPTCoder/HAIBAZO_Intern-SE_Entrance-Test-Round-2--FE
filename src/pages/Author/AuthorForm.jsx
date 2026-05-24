import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Space, message, Spin } from "antd";
import { createAuthor, updateAuthor, fetchAuthorDetail, clearCurrentAuthor } from "../../store/slices/authorSlice";

export default function AuthorForm({ id: propId, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const id = propId !== undefined ? propId : routeId;
  const isEdit = Boolean(id);
  const isModal = propId !== undefined;
  
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { currentAuthor, detailLoading } = useSelector((state) => state.authors);

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
    setSubmitting(true);
    if (isEdit) {
      dispatch(updateAuthor({ id, authorData: { name: values.name } })).unwrap().then(() => {
        setSubmitting(false);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/authors");
        }
      }).catch((err) => {
        setSubmitting(false);
        message.error("Error updating author: " + err);
      });
    } else {
      dispatch(createAuthor({ name: values.name })).unwrap().then(() => {
        setSubmitting(false);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/authors");
        }
      }).catch((err) => {
        setSubmitting(false);
        message.error("Error creating author: " + err);
      });
    }
  };

  const formContent = (
    <Spin spinning={isEdit && detailLoading} tip="Loading data...">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="name"
          label={<span className="font-medium text-zinc-655">Author Name</span>}
          rules={[
            { required: true, message: "Name must not empty" },
            { whitespace: true, message: "Name must not empty" }
          ]}
        >
          <Input
            placeholder="e.g., Haruki Murakami"
            size="large"
            className="rounded-xl"
          />
        </Form.Item>
        
        <Form.Item className="mb-0 flex justify-end gap-2 pt-4 border-t border-zinc-100">
          <Space>
            <Button 
              onClick={() => isModal ? onCancel() : navigate("/authors")} 
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
              className="bg-violet-650 hover:bg-violet-750 text-white rounded-xl cursor-pointer font-semibold"
            >
              {isEdit ? "Update" : "Create"}
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
          {isEdit ? "Edit the detailed information of the author." : "Fill in the details below to add a new author to the system."}
        </p>
      </div>

      <div className="bg-white border border-zinc-150/80 rounded-3xl p-8 shadow-xs">
        {formContent}
      </div>
    </div>
  );
}

