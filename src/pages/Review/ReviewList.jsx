import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../store/slices/reviewSlice";
import {
  Table,
  Button,
  Select,
  Popconfirm,
  Space,
  Spin,
} from "antd";

export default function ReviewList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: reviews, loading, pagination } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchReviews({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleTableChange = (page, pageSize) => {
    dispatch(fetchReviews({ page: page - 1, size: pageSize }));
  };

  const handleDelete = (id) => {
    dispatch(deleteReview(id));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <span className="font-bold text-zinc-500">#{id}</span>,
    },
    {
      title: "Cuốn Sách",
      dataIndex: "bookName",
      key: "bookName",
      render: (bookName, record) => (
        <Link
          to={`/books/${record.bookId}`}
          className="font-bold text-zinc-800 hover:text-violet-600 :text-violet-400 transition-colors"
        >
          {bookName}
        </Link>
      ),
    },
    {
      title: "Tác Giả",
      dataIndex: "authorName",
      key: "authorName",
      render: (authorName, record) => (
        <Link
          to={`/authors/${record.authorId}`}
          className="font-semibold text-zinc-500 hover:underline"
        >
          {authorName}
        </Link>
      ),
    },
    {
      title: "Nội Dung Đánh Giá",
      dataIndex: "review",
      key: "review",
      render: (text) => <span className="text-zinc-700 font-light leading-relaxed">{text}</span>,
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            className="text-violet-600 hover:text-violet-750 font-bold p-0 cursor-pointer"
            onClick={() => navigate(`/reviews/${record.id}/edit`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn có chắc chắn muốn xóa bài đánh giá này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, className: "bg-red-500 text-white cursor-pointer" }}
          >
            <Button type="link" danger className="font-bold p-0 cursor-pointer">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section with add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
            Quản Lý Đánh Giá
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            Theo dõi tất cả cảm nhận từ độc giả, thực hiện biên tập nội dung, thêm review mới và quản lý danh sách phản hồi.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/reviews/create')}
          className="rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-bold px-5 py-3 transition-all cursor-pointer shadow-md shadow-violet-500/10 flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span>Thêm Review Mới</span>
        </button>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-6 shadow-xs">
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Table
            columns={columns}
            dataSource={reviews.map(review => ({ ...review, key: review.id }))}
            pagination={{
              current: pagination.currentPage + 1,
              pageSize: pagination.pageSize,
              total: pagination.totalElements,
              onChange: handleTableChange,
              showSizeChanger: false,
              className: "pt-4",
            }}
            className="ant-table-custom"
          />
        </Spin>
      </div>
    </div>
  );
}
