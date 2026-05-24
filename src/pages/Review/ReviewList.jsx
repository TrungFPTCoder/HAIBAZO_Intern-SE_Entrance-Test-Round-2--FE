import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../store/slices/reviewSlice";
import { Table, Button, Select, Popconfirm, Space, Spin, Modal } from "antd";
import ReviewForm from "./ReviewForm";

export default function ReviewList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    items: reviews,
    loading,
    pagination,
  } = useSelector((state) => state.reviews);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchReviews({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleTableChange = (page, pageSize) => {
    dispatch(fetchReviews({ page: page - 1, size: pageSize }));
  };

  const handleDelete = (id) => {
    dispatch(deleteReview(id))
      .unwrap()
      .then(() => {
        dispatch(
          fetchReviews({
            page: pagination.currentPage,
            size: pagination.pageSize,
          }),
        );
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => (
        <span className="font-semibold text-zinc-500">#{id}</span>
      ),
    },
    {
      title: "Book",
      dataIndex: "bookName",
      key: "bookName",
      render: (bookName) => (
        <span className="font-semibold text-zinc-800">{bookName}</span>
      ),
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
      render: (authorName) => (
        <span className="font-medium text-zinc-500">{authorName}</span>
      ),
    },
    {
      title: "Review Content",
      dataIndex: "review",
      key: "review",
      width: 300,
      render: (text) => (
        <span className="text-zinc-655 font-normal leading-relaxed text-sm block line-clamp-2!">
          {text}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            className="text-violet-655 hover:text-violet-750 font-semibold p-0 cursor-pointer"
            onClick={() => setEditingId(record.id)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete review"
            description="Are you sure you want to delete this review?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              className: "bg-red-500 text-white cursor-pointer",
            }}
          >
            <Button
              type="link"
              danger
              className="font-semibold p-0 cursor-pointer"
              icon={<DeleteOutlined />}
            >
              Delete
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
          <h1 className="text-3xl font-bold text-zinc-850 tracking-tight">
            Review Management
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            Monitor readers' feedback, edit contents, add new reviews, and
            manage responses.
          </p>
        </div>

        <button
          onClick={() => navigate("/reviews/create")}
          className="rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-semibold px-5 py-3 transition-all cursor-pointer shadow-md shadow-violet-500/10 flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span>Add Review</span>
        </button>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-6 shadow-xs">
        <Spin spinning={loading} tip="Loading data...">
          <Table
            columns={columns}
            dataSource={reviews.map((review) => ({
              ...review,
              key: review.id,
            }))}
            pagination={{
              current: pagination.currentPage + 1,
              pageSize: pagination.pageSize,
              total: pagination.totalElements,
              onChange: handleTableChange,
              showSizeChanger: false,
              className: "pt-4",
            }}
            scroll={{ x: "max-content" }}
            className="ant-table-custom"
          />
        </Spin>
      </div>

      {/* Edit Review Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-zinc-800">Edit Review</span>
        }
        open={editingId !== null}
        onCancel={() => setEditingId(null)}
        footer={null}
        destroyOnHidden
        centered
        styles={{
          content: {
            borderRadius: "24px",
            padding: "24px",
          },
        }}
      >
        <ReviewForm
          id={editingId}
          onSuccess={() => {
            setEditingId(null);
            dispatch(
              fetchReviews({
                page: pagination.currentPage,
                size: pagination.pageSize,
              }),
            );
          }}
          onCancel={() => setEditingId(null)}
        />
      </Modal>
    </div>
  );
}
