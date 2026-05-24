import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../store/slices/authorSlice";
import {
  Table,
  Button,
  Popconfirm,
  Space,
  Spin,
} from "antd";

export default function AuthorList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, pagination } = useSelector((state) => state.authors);

  // Load list of authors when page or size changes
  useEffect(() => {
    dispatch(fetchAuthors({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleTableChange = (page, pageSize) => {
    // API pagination is 0-indexed, Antd is 1-indexed
    dispatch(fetchAuthors({ page: page - 1, size: pageSize }));
  };

  const handleDelete = (id) => {
    dispatch(deleteAuthor(id));
  };

  // Antd Table columns specification
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => <span className="font-bold text-zinc-500">#{id}</span>,
    },
    {
      title: "Tên Tác Giả",
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="font-semibold text-zinc-800">{name}</span>,
    },
    {
      title: "Số Tác Phẩm",
      dataIndex: "booksCount",
      key: "booksCount",
      render: (count) => (
        <span className="inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">
          {count || 0} sách
        </span>
      ),
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            className="text-violet-600 hover:text-violet-750 font-bold p-0 cursor-pointer"
            onClick={() => navigate(`/authors/${record.id}/edit`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa tác giả"
            description="Bạn có chắc chắn muốn xóa tác giả này không?"
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
            Quản Lý Tác Giả
          </h1>
          <p className="text-sm text-zinc-500 font-light">
            Xem danh sách, thêm mới, cập nhật thông tin và quản lý các tác giả trong cơ sở dữ liệu hệ thống.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/authors/create')}
          className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-3 transition-all cursor-pointer shadow-md shadow-violet-500/10 flex items-center justify-center gap-2 self-start sm:self-center"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span>Thêm Tác Giả</span>
        </button>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-zinc-150/80 rounded-3xl p-6 shadow-xs">
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Table
            columns={columns}
            dataSource={items.map(item => ({ ...item, key: item.id }))}
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
