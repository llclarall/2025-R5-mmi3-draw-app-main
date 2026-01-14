import { AppHeader } from '../shared/components/AppHeader/AppHeader'
import { DrawLayout } from '../shared/components/layouts/DrawLayout/DrawLayout'

/* import { Instructions } from '../shared/components/Instructions/Instructions'
import { getInstructions } from '../shared/utils/get-instructions' */
import { UserList } from '../features/user/components/UserList'
import { DrawArea } from '../features/drawing/components/DrawArea'
import { useUpdatedUserList } from '../features/user/hooks/useUpdatedUserList'
import { useJoinMyUser } from '../features/user/hooks/useJoinMyUser'
import { DrawToolbar } from '../features/drawing/components/DrawToolbar'

function DrawPage() {
  const { joinMyUser }  = useJoinMyUser();
  const { userList } = useUpdatedUserList();

  return (
    <DrawLayout
      topArea={<AppHeader 
        onClickJoin={() => joinMyUser()}
      />}
      rightArea={
        <>
          {/* <Instructions>
            {getInstructions('user-list')}
          </Instructions> */}
          <UserList users={userList} />
        </>
      }
      bottomArea={
        <>
          {/* <Instructions>
            {getInstructions('toolbar')}
          </Instructions> */}
          <DrawToolbar />
        </>
      }
    >
      <DrawArea />
      {/* <TestDrawArea /> */}
      {/* <Instructions className="max-w-xs">
        {getInstructions('draw-area')}
      </Instructions> */}
      
    </DrawLayout>
  )
}

export default DrawPage;
