;; devcred-bounty.clar
;; A sophisticated smart contract to manage developer bug bounties

(define-data-var admin principal tx-sender)

;; Bounties by ID: { creator, reward, assigned-to, completed, claimed }
(define-map bounties uint
  {
    creator: principal,
    reward: uint,
    assigned-to: (optional principal),
    completed: bool,
    claimed: bool
  })

(define-data-var next-bounty-id uint u1)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-BOUNTY-NOT-FOUND u101)
(define-constant ERR-ALREADY-CLAIMED u102)
(define-constant ERR-NOT-ASSIGNED u103)
(define-constant ERR-NOT-COMPLETED u104)
(define-constant ERR-NOT-CREATOR u105)

;; Admin-only check
(define-private (is-admin)
  (is-eq tx-sender (var-get admin)))

;; Create a new bounty
(define-public (create-bounty (reward uint))
  (let ((bounty-id (var-get next-bounty-id)))
    (begin
      (var-set next-bounty-id (+ bounty-id u1))
      (map-set bounties bounty-id
        {
          creator: tx-sender,
          reward: reward,
          assigned-to: none,
          completed: false,
          claimed: false
        })
      (ok bounty-id))))

;; Assign bounty to a developer
(define-public (assign-bounty (id uint) (developer principal))
  (match (map-get? bounties id)
    bounty (begin
      (asserts! (is-eq tx-sender (get creator bounty)) (err ERR-NOT-CREATOR))
      (map-set bounties id (merge bounty { assigned-to: (some developer) }))
      (ok true))
    (err ERR-BOUNTY-NOT-FOUND)))

;; Mark bounty as completed by assigned developer
(define-public (mark-completed (id uint))
  (match (map-get? bounties id)
    bounty (begin
      (asserts! (is-eq (get assigned-to bounty) (some tx-sender)) (err ERR-NOT-ASSIGNED))
      (map-set bounties id (merge bounty { completed: true }))
      (ok true))
    (err ERR-BOUNTY-NOT-FOUND)))

;; Claim reward after approval
(define-public (claim-reward (id uint))
  (match (map-get? bounties id)
    bounty (begin
      (asserts! (is-eq (get assigned-to bounty) (some tx-sender)) (err ERR-NOT-ASSIGNED))
      (asserts! (is-eq (get completed bounty) true) (err ERR-NOT-COMPLETED))
      (asserts! (is-eq (get claimed bounty) false) (err ERR-ALREADY-CLAIMED))
      (map-set bounties id (merge bounty { claimed: true }))
      (ok (get reward bounty))))
    (err ERR-BOUNTY-NOT-FOUND))

;; Admin transfer
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)))