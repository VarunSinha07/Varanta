import DashboardClient from "@/components/dashboard-client"
import { Session } from "@/lib/session"

export default async function Dashboard() {
  const session = await Session()

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-emerald-400 h-12 w-12 blur-sm"></div>
        </div>
      </div>
    )
  }

  // Fetch initial data on server side
  const [customerRes, accountsRes, transactionsRes] = await Promise.all([
    fetch(`${process.env.BETTER_AUTH_URL}/api/customers`),
    fetch(`${process.env.BETTER_AUTH_URL}/api/accounts`),
    fetch(`${process.env.BETTER_AUTH_URL}/api/transactions`),
  ])

  const [customersData, accountsData, transactionsData] = await Promise.all([
    customerRes.ok ? customerRes.json() : [],
    accountsRes.ok ? accountsRes.json() : [],
    transactionsRes.ok ? transactionsRes.json() : [],
  ])

  const currentCustomer = customersData.find((c: { userId: string }) => c.userId === session.user.id)

  return (
    <DashboardClient
      initialCustomer={currentCustomer || null}
      initialAccounts={accountsData}
      initialTransactions={transactionsData}
    />
  )
}

