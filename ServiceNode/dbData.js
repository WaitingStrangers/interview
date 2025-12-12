const db = require('./db');

//查询所有问题列表数据
async function selectQuestionList(){
    const [rows] = await db.query('SELECT * FROM Question'); 
    console.log(rows);
    return rows;
}

//查询某个面试问题数据
// @param {string} interview_id - 面试ID
async function selectInterviewData(interviewid){
    const sql = `
        SELECT 
            q.question AS questionText,       -- 题目文本
            i.raw_answer AS rawAnswer,        -- 回答文本
            i.answer_path AS mp3Path,         -- Mp3路径
            q.answer AS correctAnswer,        -- 正确答案
            i.refined_answer AS refinedAnswer -- 优化后的答案
        FROM Interview i
        JOIN Question q ON i.question_id = q.id
        WHERE i.interview_id = ?
        ORDER BY i.created_at ASC
    `;

    const [rows] = await db.query(sql, [interviewid]);
    //console.log(rows);
    return rows;
}

//查询面试列表
async function selectInterviewList(interviewid){
    const [rows] = await db.query('SELECT t.interview_id AS interviewId, ROW_NUMBER() OVER (ORDER BY MIN(t.created_at)) AS interviewIndex, MIN(t.created_at) AS interviewTime, COUNT(*) AS questionCount, TIMESTAMPDIFF(SECOND, MIN(t.created_at), MAX(t.created_at)) AS durationSeconds '+ 
        'FROM Interview t GROUP BY t.interview_id ORDER BY interviewTime ASC;');  //根据查询到的ID进行排序，ID是时间类型的
    // console.log(rows);
    return rows;
}

/**
 * 新增面试场景以及面试题和答案
 * @param {string} interview_id - 面试ID
 * @param {string} question_id - 问题ID
 * @param {string} answer_path - 音频路径
 * @param {string} raw_answer - 用户原始回答（可选）
 * @param {string} refined_answer - 系统优化后的答案（可选）
 */
async function insertInterviewData(interview_id, question_id, answer_path, raw_answer , refined_answer ) {
    try {
        const sql = `
        INSERT INTO Interview 
        (interview_id, question_id, answer_path, raw_answer, refined_answer, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
        `;
        const params = [interview_id, question_id, answer_path, raw_answer, refined_answer];
        const [result] = await db.query(sql, params);
        console.log('✅ 插入成功, ID:', result.insertId);
        return result.insertId;
    } catch (err) {
        console.error('❌ 插入面试数据失败:', err);
        throw err;
    }
}

/**
 * 新增面试题
 * @param {string} question - 问题
 * @param {string} answer - 答案
 * @param {string} typeData - 类型
 */
async function insertQuestionData(question, answer, typeData) {
    try {
        const sql = `
        INSERT INTO Question 
        (question, answer, type, created_at)
        VALUES (?, ?, ?, NOW())
        `;
        const params = [question, answer, typeData];
        const [result] = await db.query(sql, params);
        console.log('✅ 插入成功, ID:', result);
        return result.insertId;
    } catch (err) {
        console.error('❌ 插入面试数据失败:', err);
        throw err;
    }
}
/**
 * 批量新增面试题
 * @param {Map} validRows - 问题
 */
async function insertQuestionsData(validRows) {
    try {
        const sql = `
        INSERT INTO Question (question, answer, type, created_at)
        VALUES ${validRows.map(() => "(?, ?, ?, NOW())").join(",")}
        `;

        const params = validRows.flatMap((item) => [item.question, item.answer, item.typeData]);

        await db.query(sql, params);
    } catch (err) {
        console.error('❌ 插入数据失败:', err);
        throw err;
    }
}


// CommonJS 导出
module.exports = {
  selectQuestionList,insertInterviewData,selectInterviewData,selectInterviewList,insertQuestionData,insertQuestionsData
};
