package distributed_test

import (
	"fmt"
	"testing"

	"github.com/rachaeldawn/distributed"
)

func Test_Run(t *testing.T) {
	for name, testData := range tests {
		fmt.Println(name)
		mapping := distributed.Map{}
		for k, group := range testData.Groups {
			ids := make([]int, group.Size)
			mapping[k] = &distributed.Group{0, 0, group.Order, ids}
		}

		mapping.Populate()

		for page, result := range testData.Results {
			fmt.Printf("  For page %d\n", page+1)
			for group, data := range result {
				grp := mapping[group]
				mapping.FillRanges(page, 10)
				if grp.Skip != data.Skip {
					t.Errorf("    Skip does not match on %s. Expected %d, got %d", group, data.Skip, grp.Skip)
				}

				if grp.Limit != data.Limit {
					t.Errorf("    Limit does not match on %s. Expected %d, got %d", group, data.Limit, grp.Limit)
				}
			}
		}

	}
}
