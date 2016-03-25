"use strict";
let Q = require('q');

module.exports = {
  getLog(db) {
    let q = Q.defer();
    db('logs as l')
      .select('l.hospcode', 'l.filename', 'l.updated', 'h.hospname')
      .leftJoin('hospitals as h', 'h.hospcode', 'l.hospcode')
      .orderBy('l.updated', 'desc')
      .limit(50)
      .then(rows => {
        q.resolve(rows)
      })
      .catch(err => {
        q.reject(err)
      });
    
    return q.promise;
  },
  getCkd(db, start, end) {
    let q = Q.defer();
    let sql = `
    select c.HOSPCODE, h.hospname as HOSPNAME, count(distinct s.HN) as total,
    case
    when c.SEX='1' and s.CREATININE <= 0.9 then
      case
        when (141 * pow((s.CREATININE/0.9), -0.411) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) >= 90 then 1
        when (141 * pow((s.CREATININE/0.9), -0.411) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 60 and 89 then 2
        when (141 * pow((s.CREATININE/0.9), -0.411) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 30 and 59 then 3
        when (141 * pow((s.CREATININE/0.9), -0.411) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 15 and 29 then 4
        when (141 * pow((s.CREATININE/0.9), -0.411) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) < 15 then 5
      end
    when c.SEX='1' and s.CREATININE > 0.9 then
        case
        when (141 * pow((s.CREATININE/0.9), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) >= 90 then 1
        when (141 * pow((s.CREATININE/0.9), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 60 and 89 then 2
        when (141 * pow((s.CREATININE/0.9), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 30 and 59 then 3
        when (141 * pow((s.CREATININE/0.9), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 15 and 29 then 4
        when (141 * pow((s.CREATININE/0.9), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) < 15 then 5
        end
    when c.SEX='2' and s.CREATININE <= 0.7 then
        case
        when (144 * pow((s.CREATININE/0.7), -0.392) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) >= 90 then 1
        when (144 * pow((s.CREATININE/0.7), -0.392) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 60 and 89 then 2
        when (144 * pow((s.CREATININE/0.7), -0.392) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 30 and 59 then 3
        when (144 * pow((s.CREATININE/0.7), -0.392) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 15 and 29 then 4
        when (144 * pow((s.CREATININE/0.7), -0.392) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) < 15 then 5
        end
    when c.SEX='2' and s.CREATININE > 0.7 then
        case
        when (144 * pow((s.CREATININE/0.7), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) >= 90 then 1
        when (144 * pow((s.CREATININE/0.7), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 60 and 89 then 2
        when (144 * pow((s.CREATININE/0.7), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 30 and 59 then 3
        when (144 * pow((s.CREATININE/0.7), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) between 15 and 29 then 4
        when (144 * pow((s.CREATININE/0.7), -1.209) * pow(0.993, TIMESTAMPDIFF(year,c.BIRTH, s.DATE_SERV))) < 15 then 5
        end
    end as state
    
    from screen as s
    inner join chronic as c on c.HN=s.HN and c.HOSPCODE=s.HOSPCODE
    left join hospitals as h on h.hospcode=s.HOSPCODE
    where 
    s.DATE_SERV = (
        select max(s2.DATE_SERV)
        from screen as s2
        where s2.HN=s.HN and s2.HOSPCODE=s.HOSPCODE
        and s2.CREATININE>0
    )
    and s.DATE_SERV BETWEEN ? AND ?
    group by s.HOSPCODE, state
    order by s.HOSPCODE
    `;
    
    db.raw(sql, [start, end])
      .then(rows => {
        q.resolve(rows[0])
      })
      .catch(err => {
        q.reject(err)
      });
    
    return q.promise;
  },

  getCvd(db, start, end) {
    let q = Q.defer();
    let sql = `
    select h.hospname as HOSPNAME, s.HOSPCODE, s.HN, s.DATE_SERV, s.BPS as SBP, s.WEIGHT,
      s.WAIST, s.HEIGHT, s.TC, s.HDL, s.LDL, if(s.SMOKING="1", 0, 1) as SMOKING, if(c.CLINIC="001", 1, 0) as DM, c.SEX,
      TIMESTAMPDIFF(year,c.BIRTH,s.DATE_SERV) as AGE
      from screen as s
      left join chronic as c on c.HN=s.HN and c.HOSPCODE=s.HOSPCODE
      left join hospitals as h on h.hospcode=s.HOSPCODE
      where 
       s.DATE_SERV = (
        select max(s1.DATE_SERV)
        from screen as s1
        where s1.HN=s.HN and s1.HOSPCODE=s.HOSPCODE
          and s1.BPS > 0
          and s1.TC > 0
          and s1.HDL > 0
          and s1.LDL > 0
      )
      AND s.DATE_SERV BETWEEN ? AND ?
      group by s.HN, s.HOSPCODE
    `;

    db.raw(sql, [start, end])
      .then(rows => {
        q.resolve(rows[0])
      })
      .catch(err => {
        q.reject(err)
      });

    return q.promise;
  },
  
  getCVDState(age, smoke, dm, sbp, sex, tc, ldl, hdl, whr, wc) {
    let full_score = 0;
    let compare_score = 0;
    let predicted_risk = 0;
    let compare_risk = 0;
    let compare_whr = 0.52667;
    let compare_wc = 79;
    let compare_sbp = 120;
    let compare_hdl = 44;
    let sur_root = 0.978296;

    if (sex == 0) {
      compare_hdl = 49
    }
    if (sex == 1 && age > 60) {
      compare_sbp = 132
    }
    if (sex == 0 && age <= 60) {
      compare_sbp = 115
    }
    if (sex == 0 && age > 60) {
      compare_sbp = 130
    }
    if (sex == 1) {
      compare_whr = 0.58125;
      compare_wc = 93;
    }
    if (age > 1 && sbp > 50) {
      if (ldl > 0) {
        if (hdl > 0) {
          full_score = (0.08305 * age) + (0.24893 * sex) + (0.02164 * sbp) + (0.65224 * dm) + (0.00243 * ldl) + ((-0.01965) * hdl) + (0.43868 * smoke);
          predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 5.9826)));
          compare_score = (0.08305 * age) + (0.24893 * sex) + (0.02164 * compare_sbp) + (0.00243 * 130) + ((-0.01965) * compare_hdl);
          compare_risk = 1 - (Math.pow(sur_root, Math.exp(compare_score - 5.9826)));
        } else {
          full_score = (0.08169 * age) + (0.35156 * sex) + (0.02084 * sbp) + (0.65052 * dm) + (0.02094 * ldl) + (0.45639 * smoke);
          predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 6.99911)));
          compare_score = (0.08169 * age) + (0.35156 * sex) + (0.02084 * compare_sbp) + (0.02094 * 130);
          compare_risk = 1 - (Math.pow(sur_root, Math.exp(compare_score - 6.99911)));
        }
      } else if (tc > 0) {
        if (hdl > 0) {
          full_score = (0.083 * age) + (0.28094 * sex) + (0.02111 * sbp) + (0.69005 * dm) + (0.00214 * tc) + ((-0.02148) * hdl) + (0.40068 * smoke);
          predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 6.00168)));
          compare_score = (0.083 * age) + (0.28094 * sex) + (0.02111 * compare_sbp) + (0.00214 * 200) + ((-0.02148) * compare_hdl);
          compare_risk = 1 - (Math.pow(sur_root, Math.exp(compare_score - 6.00168)));
        } else {
          full_score = (0.08183 * age) + (0.39499 * sex) + (0.02084 * sbp) + (0.69974 * dm) + (0.00212 * tc) + (0.41916 * smoke);
          predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 7.04423)));
          compare_score = (0.08183 * age) + (0.39499 * sex) + (0.02084 * compare_sbp) + (0.00212 * 200);
          compare_risk = 1 - (Math.pow(sur_root, Math.exp(compare_score - 7.04423)));
        }
      } else if (whr > 0) { //ของ อ.ปริญ มีสูตรนี้สูตรเดียว
        full_score = (0.079 * age) + (0.128 * sex) + (0.019350987 * sbp) + (0.58454 * dm) + (3.512566 * whr) + (0.459 * smoke);
        predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 7.720484)));
        compare_score = (0.079 * age) + (0.128 * sex) + (0.019350987 * compare_sbp) + (3.512566 * compare_whr);
        compare_risk = 1 - (Math.pow(sur_root, Math.exp(compare_score - 7.720484)));
      } else if (wc > 0) {
        full_score = (0.08372 * age) + (0.05988 * sex) + (0.02034 * sbp) + (0.59953 * dm) + (0.01283 * wc) + (0.459 * smoke);
        predicted_risk = 1 - (Math.pow(sur_root, Math.exp(full_score - 7.31047)));
        compare_score = (0.08372 * age) + (0.05988 * sex) + (0.02034 * compare_sbp) + (0.01283 * compare_wc);
        compare_risk = 1 - (Math.pow(sur_root, Math.exp(compare_score - 7.31047)));
      } else {

      }
    }

    if (predicted_risk > 0.3) {
      predicted_risk = 0.3
    }

    return [full_score, predicted_risk, compare_score, compare_risk];
  }
};