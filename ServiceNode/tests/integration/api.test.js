const request = require('supertest');
const app = require('../../index');

// 测试API端点

describe('API Integration Tests', () => {
    // 测试问题相关API
    describe('Questions API', () => {
        it('should return all questions when GET /api/questions is called', async () => {
            const response = await request(app)
                .get('/api/questions')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(response.body).toHaveProperty('code', 200);
            expect(response.body).toHaveProperty('message', '查询成功');
            expect(Array.isArray(response.body.data)).toBeTruthy();
        });

        it('should return interview list when GET /api/InterviewList is called', async () => {
            const response = await request(app)
                .get('/api/InterviewList')
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(response.body).toHaveProperty('code', 200);
            expect(response.body).toHaveProperty('message', '查询成功');
            expect(Array.isArray(response.body.data)).toBeTruthy();
        });
    });

    describe('Interview API', () => {
        it('should handle POST /api/InterviewData with error when no id provided', async () => {
            const response = await request(app)
                .post('/api/InterviewData')
                .send({})
                .expect('Content-Type', /json/);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('code', 200);
        });

        it('should return 200 for POST /api/insertInterviewData', async () => {
            const testData = {
                interview_id: 'test-123',
                question_id: 1,
                answer_path: '/test/path.mp3',
                raw_answer: '测试原始回答',
                refined_answer: '测试优化回答'
            };
            
            const response = await request(app)
                .post('/api/insertInterviewData')
                .send(testData)
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(response.body).toHaveProperty('code', 200);
            expect(response.body).toHaveProperty('message', '面试详情存储成功');
        });
    });

    describe('Text-to-Speech API', () => {
        it('should return 400 when no text provided for POST /api/text-to-audio', async () => {
            const response = await request(app)
                .post('/api/text-to-audio')
                .send({ fileName: 'test.mp3' })
                .expect('Content-Type', /json/)
                .expect(400);
            
            expect(response.body).toHaveProperty('error', '缺少 text 参数');
        });

        it('should return 500 when POST /api/upload-mp3 is called without file', async () => {
            const response = await request(app)
                .post('/api/upload-mp3')
                .expect('Content-Type', /json/);
            
            expect(response.status).toBe(500);
        });
    });

    describe('Question Insert API', () => {
        it('should return 200 for POST /api/insertQuestionData', async () => {
            const testData = {
                question: '测试问题',
                answer: '测试答案',
                typeData: 0
            };
            
            const response = await request(app)
                .post('/api/insertQuestionData')
                .send(testData)
                .expect('Content-Type', /json/);
            
            expect(response.body).toHaveProperty('code', 200);
        });

        it('should return 400 for POST /api/batchInsertQuestionData with empty array', async () => {
            const response = await request(app)
                .post('/api/batchInsertQuestionData')
                .send([])
                .expect('Content-Type', /json/)
                .expect(400);
            
            expect(response.body).toHaveProperty('message', '参数错误，不能为空');
        });

        it('should return 200 for POST /api/batchInsertQuestionData with valid data', async () => {
            const testData = [
                {
                    question: '批量问题1',
                    answer: '批量答案1',
                    typeData: 0
                },
                {
                    question: '批量问题2',
                    answer: '批量答案2',
                    typeData: 1
                }
            ];
            
            const response = await request(app)
                .post('/api/batchInsertQuestionData')
                .send(testData)
                .expect('Content-Type', /json/);
            
            expect(response.body).toHaveProperty('code', 200);
        });
    });
});
