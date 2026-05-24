import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../store/slices/bookSlice";
import {
  Table,
  Button,
  Select,
  Popconfirm,
  Space,
  Spin,
  Modal,
} from "antd";
import BookForm from "./BookForm";

export default function BookList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: books, loading, pagination } = useSelector((state) => state.books);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchBooks({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleTableChange = (page, pageSize) => {
    dispatch(fetchBooks({ page: page - 1, size: pageSize }));
  };

  const handleDelete = (id) => {
    dispatch(deleteBook(id)).unwrap().then(() => {
      dispatch(fetchBooks({ page: pagination.currentPage, size: pagination.pageSize }));
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <span className="font-semibold text-zinc-500">#{id}</span>,
    },
    {
      title: "Book Title",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span className="font-semibold text-zinc-800">
          {name}
        </span>
      ),
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
      render: (authorName) => (
        <span className="font-medium text-zinc-650">
          {authorName}
        </span>
      ),
    },
    {
      title: "Reviews Count",
      dataIndex: "reviewsCount",
      key: "reviewsCount",
      render: (count) => (
        <span className="inline-block rounded-full bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500">
          {count || 0} reviews
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
            className="text-violet-650 hover:text-violet-750 font-semibold p-0 cursor-pointer"
            onClick={() => setEditingId(record.id)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete book"
            description="Are you sure you want to delete this book? All associated reviews will be deleted."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, className: "bg-red-500 text-white cursor-pointer" }}
          >
            <Button type="link" danger className="font-semibold p-0 cursor-pointer" icon={<DeleteOutlined />}>
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
            Book Management
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            View the list of books, their authors, reviews count, and manage entries.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/books/create')}
          className="rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-semibold px-5 py-3 transition-all cursor-pointer shadow-md shadow-violet-500/10 flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span>Add Book</span>
        </button>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-6 shadow-xs">
        <Spin spinning={loading} tip="Loading data...">
          <Table
            columns={columns}
            dataSource={books.map(book => ({ ...book, key: book.id }))}
            pagination={{
              current: pagination.currentPage + 1,
              pageSize: pagination.pageSize,
              total: pagination.totalElements,
              onChange: handleTableChange,
              showSizeChanger: false,
              className: "pt-4",
            }}
            scroll={{ x: 'max-content' }}
            className="ant-table-custom"
          />
        </Spin>
      </div>

      {/* Edit Book Modal */}
      <Modal
        title={<span className="text-xl font-bold text-zinc-800">Edit Book</span>}
        open={editingId !== null}
        onCancel={() => setEditingId(null)}
        footer={null}
        destroyOnClose
        centered
        styles={{
          content: {
            borderRadius: "24px",
            padding: "24px",
          }
        }}
      >
        <BookForm
          id={editingId}
          onSuccess={() => {
            setEditingId(null);
            dispatch(fetchBooks({ page: pagination.currentPage, size: pagination.pageSize }));
          }}
          onCancel={() => setEditingId(null)}
        />
      </Modal>
    </div>
  );
}
