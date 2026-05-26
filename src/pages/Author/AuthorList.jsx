import { Button, Modal, Popconfirm, Space, Spin, Table, Tag } from "antd";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderSection from "../../components/HeaderSection";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteAuthor, fetchAuthors } from "../../store/slices/authorSlice";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AuthorForm from "./AuthorForm";
export default function AuthorList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.authors);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAuthors({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleTableChange = (page, pageSize) => {
    dispatch(fetchAuthors({ page: page - 1, size: pageSize }));
  };
  const handleDelete = (id) => {
    dispatch(deleteAuthor(id))
      .unwrap()
      .then(() => {
        dispatch(
          fetchAuthors({
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
      title: "Author name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span className="font-semibold text-zinc-700">{name}</span>
      ),
    },
    {
      title: "Book Count",
      dataIndex: "booksCount",
      key: "booksCount",
      render: (count) => <Tag color={"green"}>{count || 0} books</Tag>,
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
            title="Delete author"
            description="Are you sure you want to delete this author?"
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
        title={"Author Management"}
        description={
          "View the list, add new, update information, and manage authors in the database."
        }
        buttonLabel={"Add author"}
        navigateTo={"/authors/create"}
      />

      <div className="bg-white border border-zinc-150/80 rounded-xl p-3 shadow-xs">
        <Table
          columns={columns}
          dataSource={items.map((item) => ({ ...item, key: item.id }))}
          pagination={{
            current: pagination.currentPage + 1,
            pageSize: pagination.pageSize,
            total: pagination.totalElements,
            onChange: handleTableChange,
            showSizeChanger: false,
            className: "pt-4",
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
      >
        <AuthorForm
          id={editingId}
          onSuccess={() => {
            setEditingId(null);
            dispatch(
              fetchAuthors({
                page: pagination.currentPage,
                size: pagination.pageSize,
              }),
            );
          }}
          onCancel={() => setEditingId(null)}
        ></AuthorForm>
      </Modal>
    </div>
  );
}
