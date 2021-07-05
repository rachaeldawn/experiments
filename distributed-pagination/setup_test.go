package distributed_test

import (
	"fmt"
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

type result struct {
	Skip  int `yaml:"Skip"`
	Limit int `yaml:"Limit"`
}

type testGroup struct {
	Order int `yaml:"Order"`
	Size  int `yaml:"Size"`
}

type test struct {
	Groups  map[string]testGroup `yaml:"Groups"`
	Results []map[string]result  `yaml:"Results"`
}

type testFile map[string]test

var tests testFile

func init() {
	if err := readTestData(); err != nil {
		fmt.Printf("Error: %s", err.Error())
		panic(err)
	}

	for _, testData := range tests {
		for gk := range testData.Groups {
			for _, r := range testData.Results {
				if _, ok := r[gk]; !ok {
					r[gk] = result{0, 0}
				}
			}
		}
	}

}

func readTestData() error {
	file, err := ioutil.ReadFile("test-data.yml")

	fmt.Printf("File: \n%s\n", string(file))
	if err != nil {
		return nil
	}

	data := testFile{}
	if err := yaml.Unmarshal(file, &data); err != nil {
		return nil
	}

	tests = data
	return nil
}
