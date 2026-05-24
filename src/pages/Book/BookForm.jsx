import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, Button, Space, Spin, message } from "antd";
import { fetchBooks, createBook, updateBook, fetchBookDetail, clearCurrentBook } from "../../store/slices/bookSlice";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import authorService from "../../services/authorService";

export default function BookForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  const isEdit = Boolean(id);

  const { currentBook, detailLoading: loadingBooks } = useSelector((state) => state.books);
  
  // Sử dụng lazyloading / infinite scroll thay cho tải 100 tác giả
  const { items: authors, loading: loadingAuthors, onPopupScroll } = useInfiniteScroll(authorService.getAll);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchBookDetail(id));
    }
    return () => {
      dispatch(clearCurrentBook());
    };
  }, [dispatch, id, isEdit]);

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
    if (editingBook && editingBook.authorId && !authors.find(a => a.id === editingBook.authorId)) {
      opts.unshift({ value: editingBook.authorId, label: editingBook.authorName || `Tác giả #${editingBook.authorId}` });
    }
    return opts;
  })();

  const handleSubmit = (values) => {
    const bookData = {
      name: values.name,
      authorId: values.authorId,
    };

    if (isEdit) {
      dispatch(updateBook({ id, bookData })).unwrap().then(() => {
        message.success("Cập nhật sách thành công!");
        navigate("/books");
      }).catch((err) => {
        message.error("Lỗi khi cập nhật: " + err);
      });
    } else {
      dispatch(createBook(bookData)).unwrap().then(() => {
        message.success("Thêm sách mới thành công!");
        navigate("/books");
      }).catch((err) => {
        message.error("Lỗi khi thêm sách: " + err);
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
          {isEdit ? "Cập Nhật Thông Tin Cuốn Sách" : "Thêm Cuốn Sách Mới"}
        </h1>
        <p className="text-sm text-zinc-500 font-light">
          {isEdit ? "Chỉnh sửa thông tin chi tiết của cuốn sách trong hệ thống." : "Điền thông tin bên dưới để thêm một cuốn sách mới vào hệ thống."}
        </p>
      </div>

      <div className="bg-white border border-zinc-150/80 rounded-3xl p-8 shadow-xs">
        <Spin spinning={loadingBooks || loadingAuthors} tip="Đang tải dữ liệu...">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label={<span className="font-semibold text-zinc-700">Tên cuốn sách</span>}
              rules={[
                { required: true, message: "Tên sách không được để trống!" },
                { whitespace: true, message: "Tên sách không được chỉ chứa khoảng trắng!" }
              ]}
            >
              <Input
                placeholder="Ví dụ: Norwegian Wood"
                size="large"
                className="rounded-xl"
              />
            </Form.Item>

            <Form.Item
              name="authorId"
              label={<span className="font-semibold text-zinc-700">Tác giả</span>}
              rules={[{ required: true, message: "Vui lòng chọn tác giả viết sách!" }]}
            >
              <Select
                placeholder="Chọn tác giả từ danh sách"
                size="large"
                className="rounded-xl select-custom"
                showSearch={{
                  optionFilterProp: "label"
                }}
                onPopupScroll={onPopupScroll}
                loading={loadingAuthors}
                options={authorOptions}
              />
            </Form.Item>
            
            <Form.Item className="mb-0 flex justify-end gap-2 pt-4 border-t border-zinc-100">
              <Space>
                <Button 
                  onClick={() => navigate("/books")} 
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
                  {isEdit ? "Cập nhật" : "Tạo sách mới"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
}
