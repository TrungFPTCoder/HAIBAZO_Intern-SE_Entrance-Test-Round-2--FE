import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Space, message, Spin } from "antd";
import { createAuthor, updateAuthor, fetchAuthorDetail, clearCurrentAuthor } from "../../store/slices/authorSlice";

export default function AuthorForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  const isEdit = Boolean(id);
  const { currentAuthor, detailLoading } = useSelector((state) => state.authors);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchAuthorDetail(id));
    }
    return () => {
      dispatch(clearCurrentAuthor());
    }
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (isEdit && currentAuthor) {
      form.setFieldsValue({
        name: currentAuthor.name,
      });
    }
  }, [isEdit, currentAuthor, form]);

  const handleSubmit = (values) => {
    if (isEdit) {
      dispatch(updateAuthor({ id, authorData: { name: values.name } })).unwrap().then(() => {
        message.success("Cập nhật tác giả thành công!");
        navigate("/authors");
      }).catch((err) => {
        message.error("Lỗi khi cập nhật: " + err);
      });
    } else {
      dispatch(createAuthor({ name: values.name })).unwrap().then(() => {
        message.success("Thêm tác giả mới thành công!");
        navigate("/authors");
      }).catch((err) => {
        message.error("Lỗi khi thêm tác giả: " + err);
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
          {isEdit ? "Cập Nhật Thông Tin Tác Giả" : "Thêm Tác Giả Mới"}
        </h1>
        <p className="text-sm text-zinc-500 font-light">
          {isEdit ? "Chỉnh sửa thông tin chi tiết của tác giả." : "Điền thông tin bên dưới để thêm một tác giả mới vào hệ thống."}
        </p>
      </div>

      <div className="bg-white border border-zinc-150/80 rounded-3xl p-8 shadow-xs">
        <Spin spinning={isEdit && detailLoading} tip="Đang tải dữ liệu...">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label={<span className="font-semibold text-zinc-700">Họ và tên tác giả</span>}
              rules={[
                { required: true, message: "Họ tên tác giả không được để trống!" },
                { whitespace: true, message: "Tên tác giả không được chỉ chứa khoảng trắng!" }
              ]}
            >
              <Input
                placeholder="Ví dụ: Haruki Murakami"
                size="large"
                className="rounded-xl"
              />
            </Form.Item>
            
            <Form.Item className="mb-0 flex justify-end gap-2 pt-4 border-t border-zinc-100">
              <Space>
                <Button 
                  onClick={() => navigate("/authors")} 
                  size="large" 
                  className="rounded-xl cursor-pointer font-semibold"
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-violet-600 hover:bg-violet-750 text-white rounded-xl cursor-pointer font-semibold"
                >
                  {isEdit ? "Cập nhật" : "Tạo tác giả mới"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
}
