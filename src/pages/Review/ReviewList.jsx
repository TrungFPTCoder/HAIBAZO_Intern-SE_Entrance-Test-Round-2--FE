import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteReview, fetchReviews } from "../../store/slices/reviewSlice";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Modal, Popconfirm, Space, Table } from "antd";
import HeaderSection from "../../components/HeaderSection";
import ReviewForm from "./ReviewForm";

export default function ReviewList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: reviews, loading, pagination } = useSelector((state) => state.reviews);
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
      width: 100,
      render: (id) => (
        <span className="font-semibold text-zinc-500">#{id}</span>
      ),
    },
    {
      title: "Book title",
      dataIndex: "bookName",
      key: "bookName",
      render: (bookName) => (
        <span className="font-semibold text-zinc-700">{bookName}</span>
      ),
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
      render: (authorName) => (
        <span className="font-medium text-zinc-650">{authorName}</span>
      ),
    },
    {
      title: "Review content",
      dataIndex: "review",
      key: "review",
      width:300,
      render: (text) => (
        <span className="text-zinc-600 font-normal leading-relaxed text-sm line-clamp-2!">
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            variant="outlined"
            onClick={() => setEditingId(record.id)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Review"
            description="Are you sure you want to delete this review?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record.id)}
            okButtonProps={{
              danger: true,
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div className="space-y-8 animate-fade-in">
      <HeaderSection
        title={"Review Management"}
        description={
          "View the list, add new, update information, and manage reviews in the database."
        }
        buttonLabel={"Add review"}
        navigateTo={"/reviews/create"}
      />

      <div className="bg-white border border-zinc-150/80 rounded-xl p-3 shadow-xs">
        <Table
          columns={columns}
          dataSource={reviews.map((review) => ({ ...review, key: review.id }))}
          pagination={{
            current: pagination.currentPage + 1,
            pageSize: pagination.pageSize,
            total: pagination.totalElements,
            onChange: handleTableChange,
            showSizeChanger: false,
          }}
          scroll={{ x: "max-content" }}
          loading={loading}
        />
      </div>

      <Modal
        open={editingId !== null}
        onCancel={() => setEditingId(null)}
        footer={null}
        destroyOnHidden
        centered
        style={{ content: { borderRadius: "24px", padding: "24px" } }}
        width={"50%"}
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
        ></ReviewForm>
      </Modal>
    </div>
  );
}
