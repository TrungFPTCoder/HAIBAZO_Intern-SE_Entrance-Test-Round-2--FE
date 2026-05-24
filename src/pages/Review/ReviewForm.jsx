import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, Button, Space, Spin, message } from "antd";
import { fetchReviews, createReview, updateReview, fetchReviewDetail, clearCurrentReview } from "../../store/slices/reviewSlice";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import bookService from "../../services/bookService";

export default function ReviewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  const isEdit = Boolean(id);

  const { currentReview, detailLoading: loadingReviews } = useSelector((state) => state.reviews);
  
  // Sử dụng lazyloading / infinite scroll thay cho tải 100 cuốn sách
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
      opts.unshift({ value: editingReview.bookId, label: editingReview.bookName || `Sách #${editingReview.bookId}` });
    }
    return opts;
  })();

  const handleSubmit = (values) => {
    const reviewData = {
      bookId: values.bookId,
      review: values.review,
    };

    if (isEdit) {
      dispatch(updateReview({ id, reviewData })).unwrap().then(() => {
        message.success("Cập nhật đánh giá thành công!");
        navigate("/reviews");
      }).catch((err) => {
        message.error("Lỗi khi cập nhật: " + err);
      });
    } else {
      dispatch(createReview(reviewData)).unwrap().then(() => {
        message.success("Thêm bài đánh giá mới thành công!");
        navigate("/reviews");
      }).catch((err) => {
        message.error("Lỗi khi thêm: " + err);
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
          {isEdit ? "Chỉnh Sửa Bài Đánh Giá" : "Viết Bài Đánh Giá Mới"}
        </h1>
        <p className="text-sm text-zinc-500 font-light">
          {isEdit ? "Cập nhật nội dung đánh giá của bạn cho cuốn sách." : "Chia sẻ cảm nhận của bạn về một cuốn sách trong hệ thống."}
        </p>
      </div>

      <div className="bg-white border border-zinc-150/80 rounded-3xl p-8 shadow-xs">
        <Spin spinning={loadingBooks || loadingReviews} tip="Đang tải dữ liệu...">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="bookId"
              label={<span className="font-semibold text-zinc-700">Chọn cuốn sách đánh giá</span>}
              rules={[{ required: true, message: "Vui lòng chọn cuốn sách cần viết review!" }]}
            >
              <Select
                placeholder="Chọn cuốn sách từ danh sách"
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
              label={<span className="font-semibold text-zinc-700">Nội dung đánh giá</span>}
              rules={[
                { required: true, message: "Nội dung đánh giá không được để trống!" },
                { whitespace: true, message: "Nội dung không được chỉ chứa khoảng trắng!" }
              ]}
            >
              <Input.TextArea
                placeholder="Nhập cảm nhận của bạn về cuốn sách..."
                size="large"
                rows={5}
                className="rounded-xl resize-none"
              />
            </Form.Item>
            
            <Form.Item className="mb-0 flex justify-end gap-2 pt-4 border-t border-zinc-100">
              <Space>
                <Button 
                  onClick={() => navigate("/reviews")} 
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
                  {isEdit ? "Cập nhật" : "Lưu lại"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
}
