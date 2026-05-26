import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteBook, fetchBooks } from "../../store/slices/bookSlice";
import { Button, Modal, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import HeaderSection from "../../components/HeaderSection";
import BookForm from "./BookForm";

export default function BookList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: books, loading, pagination } = useSelector((state) => state.books);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchBooks({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleTableChange = (page, pageSize) => {
    dispatch(fetchBooks({ page: page - 1, size: pageSize }));
  };
  const handleDelete = (id) => {
    dispatch(deleteBook(id))
      .unwrap()
      .then(() => {
        dispatch(
          fetchBooks({
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
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span className="font-semibold text-zinc-700">{name}</span>
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
      title: "Review Count",
      dataIndex: "reviewsCount",
      key: "reviewsCount",
      render: (count) => <Tag color={"blue"}>{count || 0} Reviews</Tag>,
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
            title="Delete Book"
            description="Are you sure you want to delete this book?"
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
        title={"Book Management"}
        description={
          "View the list, add new, update information, and manage books in the database."
        }
        buttonLabel={"Add book"}
        navigateTo={"/books/create"}
      />

      <div className="bg-white border border-zinc-150/80 rounded-xl p-3 shadow-xs">
        <Table
          columns={columns}
          dataSource={books.map((book) => ({ ...book, key: book.id }))}
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
        <BookForm
          id={editingId}
          onSuccess={() => {
            setEditingId(null);
            dispatch(
              fetchBooks({
                page: pagination.currentPage,
                size: pagination.pageSize,
              }),
            );
          }}
          onCancel={() => setEditingId(null)}
        ></BookForm>
      </Modal>
    </div>
  );
}
