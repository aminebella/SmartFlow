// // ← tickets list (manager: full control, member: view)

// // No separate page per role — one page, conditional UI
// {projectRole === 'MANAGER' && (
//   <button onClick={openCreateTicketModal}>+ New Ticket</button>
// )}
// // Member sees the list but not the button — clean and simple