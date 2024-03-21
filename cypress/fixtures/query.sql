SELECT 
  CONCAT('{"', pa.accountnumber, '", "', t.transactionId, '"},') AS posTransaction,
  pa.accountnumber, 
  t.transactionId, 
  t.status, 
  t.merchantId, 
  t.createtime, 
  t.tid, 
  t.version, 
  t.oid, 
  t.chargeAmount, 
  t.tip, 
  t.refundAmount, 
  t.avsResponseCode, 
  t.payerId, 
  t.transactionHistoryId, 
  t.creditCardEnding, 
  t.creditCardType, 
  t.paymentToken, 
  t.updatetime    
FROM 
  payment.transaction t
  JOIN payment.clientAccount ca ON t.merchantId = ca.merchantId
  JOIN payment.propayAccount pa ON ca.rid = pa.rid
WHERE 
  1=1 
  AND t.createtime BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
  AND t.status IN ('AUTHORIZE', 'AUTHORIZE_INTERNAL')
ORDER BY 
  t.createtime DESC;