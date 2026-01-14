
type Props = {
  users: { username: string }[]
}

export function UserList({ users }: Props) {
  return (
    <div className="user-list">
      <h3>Users</h3>
      <ul className='list'>
        {users.map((user, index) => (
          <li key={index} className="list-row">{user.username}</li>
        ))}
      </ul>
    </div>
  )
}