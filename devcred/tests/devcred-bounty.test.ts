import { describe, it, expect, beforeEach } from "vitest"

const mockBountyContract = {
  admin: "STADMIN",
  bounties: new Map<number, any>(),
  nextBountyId: 1,

  isAdmin(caller: string) {
    return caller === this.admin
  },

  createBounty(caller: string, reward: number) {
    const id = this.nextBountyId++
    this.bounties.set(id, {
      creator: caller,
      reward,
      assignedTo: null,
      completed: false,
      claimed: false,
    })
    return { value: id }
  },

  assignBounty(caller: string, id: number, developer: string) {
    const bounty = this.bounties.get(id)
    if (!bounty) return { error: 101 } // ERR-BOUNTY-NOT-FOUND
    if (bounty.creator !== caller) return { error: 105 } // ERR-NOT-CREATOR

    bounty.assignedTo = developer
    return { value: true }
  },

  markCompleted(caller: string, id: number) {
    const bounty = this.bounties.get(id)
    if (!bounty) return { error: 101 }
    if (bounty.assignedTo !== caller) return { error: 103 } // ERR-NOT-ASSIGNED

    bounty.completed = true
    return { value: true }
  },

  claimReward(caller: string, id: number) {
    const bounty = this.bounties.get(id)
    if (!bounty) return { error: 101 }
    if (bounty.assignedTo !== caller) return { error: 103 }
    if (!bounty.completed) return { error: 104 } // ERR-NOT-COMPLETED
    if (bounty.claimed) return { error: 102 } // ERR-ALREADY-CLAIMED

    bounty.claimed = true
    return { value: bounty.reward }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
    this.admin = newAdmin
    return { value: true }
  },
}

describe("DevCred Bounty Contract", () => {
  beforeEach(() => {
    mockBountyContract.admin = "STADMIN"
    mockBountyContract.bounties = new Map()
    mockBountyContract.nextBountyId = 1
  })

  it("should allow admin to create a bounty", () => {
    const result = mockBountyContract.createBounty("STADMIN", 1000)
    expect(result.value).toBe(1)
    expect(mockBountyContract.bounties.get(1).reward).toBe(1000)
  })

  it("should allow creator to assign bounty", () => {
    const id = mockBountyContract.createBounty("STADMIN", 500).value
    const result = mockBountyContract.assignBounty("STADMIN", id, "STDEV1")
    expect(result).toEqual({ value: true })
    expect(mockBountyContract.bounties.get(id).assignedTo).toBe("STDEV1")
  })

  it("should not allow non-creator to assign bounty", () => {
    const id = mockBountyContract.createBounty("STADMIN", 500).value
    const result = mockBountyContract.assignBounty("STHACKER", id, "STDEV1")
    expect(result).toEqual({ error: 105 }) // ERR-NOT-CREATOR
  })

  it("should allow assigned dev to mark as completed", () => {
    const id = mockBountyContract.createBounty("STADMIN", 800).value
    mockBountyContract.assignBounty("STADMIN", id, "STDEV1")
    const result = mockBountyContract.markCompleted("STDEV1", id)
    expect(result).toEqual({ value: true })
    expect(mockBountyContract.bounties.get(id).completed).toBe(true)
  })

  it("should not allow unassigned dev to mark as completed", () => {
    const id = mockBountyContract.createBounty("STADMIN", 800).value
    mockBountyContract.assignBounty("STADMIN", id, "STDEV1")
    const result = mockBountyContract.markCompleted("STDEV2", id)
    expect(result).toEqual({ error: 103 }) // ERR-NOT-ASSIGNED
  })

  it("should allow reward claim after completion", () => {
    const id = mockBountyContract.createBounty("STADMIN", 750).value
    mockBountyContract.assignBounty("STADMIN", id, "STDEV1")
    mockBountyContract.markCompleted("STDEV1", id)
    const result = mockBountyContract.claimReward("STDEV1", id)
    expect(result).toEqual({ value: 750 })
    expect(mockBountyContract.bounties.get(id).claimed).toBe(true)
  })

  it("should not allow duplicate reward claim", () => {
    const id = mockBountyContract.createBounty("STADMIN", 750).value
    mockBountyContract.assignBounty("STADMIN", id, "STDEV1")
    mockBountyContract.markCompleted("STDEV1", id)
    mockBountyContract.claimReward("STDEV1", id)
    const second = mockBountyContract.claimReward("STDEV1", id)
    expect(second).toEqual({ error: 102 }) // ERR-ALREADY-CLAIMED
  })

  it("should allow admin transfer", () => {
    const result = mockBountyContract.transferAdmin("STADMIN", "STNEWADMIN")
    expect(result).toEqual({ value: true })
    expect(mockBountyContract.admin).toBe("STNEWADMIN")
  })

  it("should not allow non-admin to transfer admin", () => {
    const result = mockBountyContract.transferAdmin("STHACKER", "STNEWADMIN")
    expect(result).toEqual({ error: 100 }) // ERR-NOT-AUTHORIZED
  })
})
