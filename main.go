package main

import (
    "encoding/csv"
    "log"
    "net/http"
    "os"
    "path/filepath"
    "strings"
   // "time"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

type PersonData struct {
    Name        string   `json:"name"`
    Dynasty     string   `json:"dynasty"`
    Category    string   `json:"category"`
    Year        string   `json:"year"`
    Achievements []string `json:"achievements"`
    Description string   `json:"description"`
}

// 全局数据存储
var (
    categoryData map[string][]PersonData
    allPersons  []PersonData
)

func main() {
    // 初始化数据
    categoryData = make(map[string][]PersonData)
    loadAllData()

    r := gin.Default()

    // CORS配置
    config := cors.DefaultConfig()
    config.AllowAllOrigins = true
    r.Use(cors.New(config))

    // 静态文件和模板
    r.Static("/static", "./static")
    r.LoadHTMLGlob("templates/*")

    // 页面路由
    r.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", nil)
    })

    // API路由
    api := r.Group("/api")
    {
        api.GET("/search", search)
        api.GET("/statistics", getStatistics)
        api.GET("/timeline", getTimeline)
        api.GET("/categories", getCategories)
    }

    r.Run(":8080")
}

func loadAllData() {
    categories := []string{"农业", "化学", "医学生物", "天文地理", "工程建筑", "数学计量", "物理"}
    
    for _, category := range categories {
        basePath := filepath.Join("database", strings.ReplaceAll(category, "生物", ""))
        
        // 读取人物数据
        personPath := filepath.Join(basePath, category+"_人物_clean.csv")
        achievementPath := filepath.Join(basePath, category+"_成就_clean.csv")
        
        persons := loadPersonData(category, personPath)
        achievements := loadAchievementData(achievementPath)
        
        // 合并人物和成就数据
        for i := range persons {
            if achievs, ok := achievements[persons[i].Name]; ok {
                persons[i].Achievements = achievs
            }
        }
        
        categoryData[category] = persons
        allPersons = append(allPersons, persons...)
    }
}

func loadPersonData(category, filepath string) []PersonData {
    file, err := os.Open(filepath)
    if err != nil {
        log.Printf("Warning: Could not open %s: %v", filepath, err)
        return nil
    }
    defer file.Close()

    reader := csv.NewReader(file)
    data, err := reader.ReadAll()
    if err != nil {
        log.Printf("Warning: Could not read %s: %v", filepath, err)
        return nil
    }

    var persons []PersonData
    for i, row := range data {
        if i == 0 || len(row) < 2 { // 跳过表头和无效行
            continue
        }
        person := PersonData{
            Name:     row[0],
            Dynasty:  row[1],
            Category: category,
        }
        if len(row) > 2 {
            person.Description = row[2]
        }
        persons = append(persons, person)
    }
    return persons
}

func loadAchievementData(filepath string) map[string][]string {
    file, err := os.Open(filepath)
    if err != nil {
        log.Printf("Warning: Could not open %s: %v", filepath, err)
        return nil
    }
    defer file.Close()

    reader := csv.NewReader(file)
    data, err := reader.ReadAll()
    if err != nil {
        log.Printf("Warning: Could not read %s: %v", filepath, err)
        return nil
    }

    achievements := make(map[string][]string)
    for i, row := range data {
        if i == 0 || len(row) < 2 { // 跳过表头和无效行
            continue
        }
        name := row[0]
        if len(row) > 1 {
            achievements[name] = append(achievements[name], row[1])
        }
    }
    return achievements
}

func search(c *gin.Context) {
    query := strings.ToLower(c.Query("query"))
    if query == "" {
        c.JSON(http.StatusOK, gin.H{"labels": []string{}, "values": [][]string{}})
        return
    }

    var results []PersonData
    for _, person := range allPersons {
        if strings.Contains(strings.ToLower(person.Name), query) {
            results = append(results, person)
        }
    }

    c.JSON(http.StatusOK, results)
}

func getStatistics(c *gin.Context) {
    stats := struct {
        Categories []struct {
            Name  string `json:"name"`
            Count int    `json:"y"`
        } `json:"categories"`
        Dynasties []struct {
            Name  string `json:"name"`
            Count int    `json:"count"`
        } `json:"dynasties"`
        Timeline struct {
            Years        []string `json:"years"`
            Achievements []int    `json:"achievements"`
        } `json:"timeline"`
    }{}

    // 统计各类别人数
    for category, persons := range categoryData {
        stats.Categories = append(stats.Categories, struct {
            Name  string `json:"name"`
            Count int    `json:"y"`
        }{
            Name:  category,
            Count: len(persons),
        })
    }

    // 统计朝代分布
    dynastyCount := make(map[string]int)
    for _, person := range allPersons {
        dynastyCount[person.Dynasty]++
    }
    for dynasty, count := range dynastyCount {
        stats.Dynasties = append(stats.Dynasties, struct {
            Name  string `json:"name"`
            Count int    `json:"count"`
        }{
            Name:  dynasty,
            Count: count,
        })
    }

    c.JSON(http.StatusOK, stats)
}

func getTimeline(c *gin.Context) {
    dynasty := c.Query("dynasty")
    var timelineData []PersonData

    for _, person := range allPersons {
        if dynasty == "" || person.Dynasty == dynasty {
            timelineData = append(timelineData, person)
        }
    }

    // 按时间排序（这里简化处理，实际可能需要更复杂的排序逻辑）
    c.JSON(http.StatusOK, timelineData)
}

func getCategories(c *gin.Context) {
    category := c.Query("category")
    if category == "" {
        c.JSON(http.StatusOK, categoryData)
        return
    }
    
    if persons, exists := categoryData[category]; exists {
        c.JSON(http.StatusOK, persons)
    } else {
        c.JSON(http.StatusOK, []PersonData{})
    }
} 