import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
} from "antd";

export default function BookList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: books, loading, pagination } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleTableChange = (page, pageSize) => {
    dispatch(fetchBooks({ page: page - 1, size: pageSize }));
  };

  const handleDelete = (id) => {
    dispatch(deleteBook(id));
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
      title: "Tên Cuốn Sách",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Link
          to={`/books/${record.id}`}
          className="font-bold text-zinc-800 hover:text-violet-600 :text-violet-400 transition-colors"
        >
          {name}
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
          className="font-semibold text-violet-600 hover:underline"
        >
          {authorName}
        </Link>
      ),
    },
    {
      title: "Số Lượt Review",
      dataIndex: "reviewsCount",
      key: "reviewsCount",
      render: (count) => (
        <span className="inline-block rounded-full bg-zinc-50 px-3 py-1 text-xs font-bold text-zinc-500">
          {count || 0} lượt review
        </span>
      ),
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
            onClick={() => navigate(`/books/${record.id}/edit`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sách"
            description="Bạn có chắc chắn muốn xóa cuốn sách này không? Tất cả review liên quan sẽ bị xóa."
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
            Quản Lý Sách
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            Xem danh sách các đầu sách, tác giả tương ứng, số lượt review và thực hiện chỉnh sửa, quản lý dữ liệu.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/books/create')}
          className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-3 transition-all cursor-pointer shadow-md shadow-violet-500/10 flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span>Thêm Sách Mới</span>
        </button>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-6 shadow-xs">
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
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
            className="ant-table-custom"
          />
        </Spin>
      </div>
    </div>
  );
}
