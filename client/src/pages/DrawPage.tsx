import { useState } from 'react';
import { AppHeader } from '../shared/components/AppHeader/AppHeader'
import { DrawLayout } from '../shared/components/layouts/DrawLayout/DrawLayout'
import { UserList } from '../features/user/components/UserList'
import { DrawArea } from '../features/drawing/components/DrawArea'
import { useUpdatedUserList } from '../features/user/hooks/useUpdatedUserList'
import { useJoinMyUser } from '../features/user/hooks/useJoinMyUser'
import { DrawToolbar } from '../features/drawing/components/DrawToolbar'
import { UsernamePseudo } from '../features/user/components/UsernamePseudo'
import { useMyUserStore } from '../features/user/store/useMyUserStore'

function DrawPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { joinMyUser } = useJoinMyUser();
  const { userList } = useUpdatedUserList();
  const { myUser } = useMyUserStore();

  const handleJoinWithUsername = (username: string) => {
    joinMyUser(username);
    setIsModalOpen(false);
  };

  return (
    <>
      <UsernamePseudo 
        isOpen={isModalOpen} 
        onConfirm={handleJoinWithUsername}
      />
      
      <DrawLayout
        topArea={<AppHeader 
          onClickJoin={() => !myUser ? setIsModalOpen(true) : null}
        />}
        rightArea={
          <>
            <UserList users={userList} />
          </>
        }
        bottomArea={
          <>
            <DrawToolbar />
          </>
        }
      >
        <DrawArea />
      </DrawLayout>
    </>
  )
}

export default DrawPage;