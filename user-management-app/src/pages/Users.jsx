import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchUsers, deleteUser } from '../redux/actions/usersActions';
import { logout } from '../redux/actions/authActions';
import Modal from '../components/common/Modal';
import UserForm from '../components/users/UserForm';
import Loader from '../components/common/Loader';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
`;

const Header = styled.header`
  background: #0c2d48;
  color: white;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: #e74c3c;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Content = styled.div`
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PageHeader = styled.div`
  background: white;
  padding: 24px 32px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Title = styled.h1`
  margin: 0 0 24px 0;
  font-size: 28px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const LeftControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 8px 16px;
  border: none;
  background: ${(props) => (props.active ? '#4a90e2' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#666')};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background: ${(props) => (props.active ? '#4a90e2' : '#f5f5f5')};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  min-width: 280px;
  transition: all 0.3s;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  @media (max-width: 768px) {
    min-width: 0;
    flex: 1;
  }
`;

const ClearButton = styled.button`
  padding: 10px 12px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background: #e8e8e8;
  }
`;

const SearchIcon = styled.span`
  font-size: 18px;
`;

const CreateButton = styled.button`
  padding: 12px 24px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #357abd;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f8f9fa;
  border-bottom: 2px solid #e8e8e8;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #666;
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const Email = styled.a`
  color: #4a90e2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
`;

const EditButton = styled(ActionButton)`
  background: #4a90e2;
  color: white;

  &:hover {
    background: #357abd;
  }
`;

const DeleteButton = styled(ActionButton)`
  background: #e74c3c;
  color: white;

  &:hover {
    background: #c0392b;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px 32px 80px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  min-height: 320px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const CardAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
`;

const CardName = styled.h3`
  margin: 0 0 12px 0;
  font-size: 22px;
  color: #333;
`;

const CardEmail = styled.a`
  color: #999;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 24px;
  display: block;
  word-break: break-word;
  max-width: 100%;
  padding: 0 60px;

  &:hover {
    color: #4a90e2;
  }

  @media (max-width: 480px) {
    padding: 0 40px;
    font-size: 13px;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 12px;
  position: absolute;
  bottom: 24px;
  right: 24px;
`;

const CardActionButton = styled.button`
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s;
`;

const CardEditButton = styled(CardActionButton)`
  background: #4a90e2;
  color: white;

  &:hover {
    background: #357abd;
    transform: scale(1.1);
  }
`;

const CardDeleteButton = styled(CardActionButton)`
  background: #e74c3c;
  color: white;

  &:hover {
    background: #c0392b;
    transform: scale(1.1);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: ${(props) => (props.active ? '#4a90e2' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#666')};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  min-width: 40px;

  &:hover:not(:disabled) {
    background: ${(props) => (props.active ? '#4a90e2' : '#f5f5f5')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 32px;
  color: #999;
`;

const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const EmptyStateText = styled.p`
  font-size: 18px;
  margin: 0;
`;

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, page, total_pages } = useSelector(
    (state) => state.users
  );
  const { user } = useSelector((state) => state.auth);

  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers(currentPage));
  }, [dispatch, currentPage]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    return users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (deleteConfirm === userId) {
      const result = await dispatch(deleteUser(userId));
      setDeleteConfirm(null);
      if (result.success) {
        // Refresh current page to see updated data
        dispatch(fetchUsers(currentPage));
      }
    } else {
      setDeleteConfirm(userId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    // Always go to page 1 after create/update to see the changes
    setCurrentPage(1);
    dispatch(fetchUsers(1));
  };

  const getUserInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= total_pages; i++) {
      pages.push(
        <PageButton
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </PageButton>
      );
    }

    return (
      <Pagination>
        <PageButton
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </PageButton>
        {pages}
        <PageButton
          onClick={() =>
            setCurrentPage((prev) => Math.min(total_pages, prev + 1))
          }
          disabled={currentPage === total_pages}
        >
          &gt;
        </PageButton>
      </Pagination>
    );
  };

  if (loading && users.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <Container>
      <Header>
        <UserInfo>
          <UserAvatar>{getUserInitials(user?.email)}</UserAvatar>
          <UserName>
            {user?.email?.split('@')[0] || 'Elon Musk'}
          </UserName>
        </UserInfo>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <Content>
        <PageHeader>
          <Title>Users</Title>
          <Controls>
            <LeftControls>
              <ViewToggle>
                <ViewButton
                  active={viewMode === 'table'}
                  onClick={() => setViewMode('table')}
                >
                  📊 Table
                </ViewButton>
                <ViewButton
                  active={viewMode === 'card'}
                  onClick={() => setViewMode('card')}
                >
                  🎴 Card
                </ViewButton>
              </ViewToggle>
            </LeftControls>

            <SearchContainer>
              <SearchIcon>🔍</SearchIcon>
              <SearchInput
                type="text"
                placeholder="input search text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <ClearButton onClick={() => setSearchTerm('')}>
                  ⊗
                </ClearButton>
              )}
              <CreateButton onClick={handleCreateUser}>
                Create User
              </CreateButton>
            </SearchContainer>
          </Controls>
        </PageHeader>

        {filteredUsers.length === 0 ? (
          <TableContainer>
            <EmptyState>
              <EmptyStateIcon>🔍</EmptyStateIcon>
              <EmptyStateText>
                {searchTerm
                  ? 'No users found matching your search'
                  : 'No users available'}
              </EmptyStateText>
            </EmptyState>
          </TableContainer>
        ) : viewMode === 'table' ? (
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Email</Th>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <UserCell>
                        <Avatar src={user.avatar} alt={user.first_name} />
                      </UserCell>
                    </Td>
                    <Td>
                      <Email href={`mailto:${user.email}`}>{user.email}</Email>
                    </Td>
                    <Td>{user.first_name}</Td>
                    <Td>{user.last_name}</Td>
                    <Td>
                      <ActionButtons>
                        <EditButton onClick={() => handleEditUser(user)}>
                          Edit
                        </EditButton>
                        <DeleteButton onClick={() => handleDeleteUser(user.id)}>
                          {deleteConfirm === user.id ? 'Confirm?' : 'Delete'}
                        </DeleteButton>
                      </ActionButtons>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <CardsContainer>
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardAvatar src={user.avatar} alt={user.first_name} />
                <CardName>
                  {user.first_name} {user.last_name}
                </CardName>
                <CardEmail href={`mailto:${user.email}`}>
                  {user.email}
                </CardEmail>
                <CardActions>
                  <CardEditButton onClick={() => handleEditUser(user)}>
                    ✏️
                  </CardEditButton>
                  <CardDeleteButton onClick={() => handleDeleteUser(user.id)}>
                    🗑️
                  </CardDeleteButton>
                </CardActions>
              </Card>
            ))}
          </CardsContainer>
        )}

        {filteredUsers.length > 0 && !searchTerm && renderPagination()}
      </Content>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedUser ? 'Edit User' : 'Create New User'}
      >
        <UserForm
          user={selectedUser}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      </Modal>
    </Container>
  );
};

export default Users;
